let currentGame = null;
let gameLoopId = null;
let score = 0;
let isPlaying = false;

// Global references
const container = document.getElementById('gameCanvasContainer');
const ui = document.getElementById('uiLayer');
const startScreen = document.getElementById('startScreen');
const scoreDisplay = document.getElementById('scoreDisplay');

// Game Definitions
const games = {
    voxel: {
        title: "Voxel World (3D)",
        desc: "A Minecraft-inspired sandbox. Build structures using different block types. Runs natively in your browser!",
        controls: "Left Click: Add Block | Shift + Click: Remove Block | Drag: Rotate Camera"
    },
    shooter: {
        title: "Target Practice",
        desc: "Test your aim! Shoot the red targets before they disappear. Don't hit the civilians (green).",
        controls: "Mouse: Aim | Left Click: Shoot"
    },
    knife: {
        title: "Knife Master",
        desc: "Throw knives into the rotating log. Avoid hitting other knives!",
        controls: "Click or Spacebar: Throw Knife"
    },
    story: {
        title: "Chronicles of Freedom",
        desc: "An interactive text adventure set during the historic movements.",
        controls: "Mouse: Choose your path"
    }
};

function loadGame(gameType) {
    // 1. Cleanup
    stopGame();
    container.innerHTML = ''; // Clear canvas
    document.querySelectorAll('.game-menu button').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active'); // Highlight button
    
    currentGame = gameType;
    
    // 2. Update UI
    document.getElementById('gameTitle').innerText = games[gameType].title;
    document.getElementById('gameDesc').innerText = games[gameType].desc;
    document.querySelector('#startScreen p:nth-of-type(2)').innerText = games[gameType].controls;
    
    startScreen.style.display = 'block';
    ui.style.display = 'none';
}

function startGame() {
    startScreen.style.display = 'none';
    ui.style.display = 'block';
    isPlaying = true;
    score = 0;
    scoreDisplay.innerText = "";

    if (currentGame === 'voxel') initVoxelGame();
    else if (currentGame === 'shooter') initShooterGame();
    else if (currentGame === 'knife') initKnifeGame();
    else if (currentGame === 'story') initStoryGame();
}

function stopGame() {
    isPlaying = false;
    cancelAnimationFrame(gameLoopId);
    // Remove any event listeners if needed (simplified)
}

// ==========================================
// GAME 1: VOXEL WORLD (Three.js)
// ==========================================
function initVoxelGame() {
    if (typeof THREE === 'undefined') return alert("Three.js not loaded");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    // Grid / Ground
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);
    const geometry = new THREE.PlaneGeometry(20, 20);
    geometry.rotateX(-Math.PI / 2);
    const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(plane);
    
    const objects = [plane]; // Raycast targets

    // Cube settings
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const cubeMat = new THREE.MeshLambertMaterial({ color: 0x00D9A3, map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/crate.gif') });

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isShiftDown = false;

    document.addEventListener('keydown', (event) => { if(event.shiftKey) isShiftDown = true; });
    document.addEventListener('keyup', (event) => { if(!event.shiftKey) isShiftDown = false; });

    renderer.domElement.addEventListener('pointerdown', (event) => {
        if (!isPlaying) return;
        event.preventDefault();

        // Calculate mouse position
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            if (isShiftDown) {
                // Remove block
                if (intersect.object !== plane) {
                    scene.remove(intersect.object);
                    objects.splice(objects.indexOf(intersect.object), 1);
                }
            } else {
                // Add block
                const voxel = new THREE.Mesh(cubeGeo, cubeMat);
                voxel.position.copy(intersect.point).add(intersect.face.normal).divideScalar(1).floor().multiplyScalar(1).addScalar(0.5);
                scene.add(voxel);
                objects.push(voxel);
            }
        }
    });

    // Orbit Controls (Simple implementation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', () => isDragging = true);
    renderer.domElement.addEventListener('mouseup', () => isDragging = false);
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = { x: e.offsetX - previousMousePosition.x, y: e.offsetY - previousMousePosition.y };
            const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1), toRadians(deltaMove.x * 1), 0, 'XYZ'
            ));
            camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    function toRadians(angle) { return angle * (Math.PI / 180); }

    function animate() {
        if (!isPlaying) return;
        gameLoopId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

// ==========================================
// GAME 2: SHOOTER (Canvas)
// ==========================================
function initShooterGame() {
    container.innerHTML = '<canvas id="gameCanvas"></canvas>';
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const targets = [];
    score = 0;
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        for (let i = targets.length - 1; i >= 0; i--) {
            const t = targets[i];
            const dist = Math.sqrt((clickX - t.x) ** 2 + (clickY - t.y) ** 2);
            if (dist < t.radius) {
                targets.splice(i, 1);
                score += 10;
                scoreDisplay.innerText = "Score: " + score;
                createExplosion(clickX, clickY);
                return;
            }
        }
    });

    function spawnTarget() {
        if (!isPlaying) return;
        const radius = 30;
        targets.push({
            x: Math.random() * (canvas.width - 60) + 30,
            y: Math.random() * (canvas.height - 60) + 30,
            radius: radius,
            life: 100
        });
        setTimeout(spawnTarget, 1000 - (score * 5)); // Gets faster
    }

    function createExplosion(x, y) {
        // Simple visual feedback
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI*2);
        ctx.fill();
    }

    function loop() {
        if (!isPlaying) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Crosshair
        // (Handled by CSS cursor usually, but drawing for effect)
        
        for (let i = targets.length - 1; i >= 0; i--) {
            const t = targets[i];
            t.life--;
            if (t.life <= 0) {
                targets.splice(i, 1); // Despawn
                continue;
            }
            
            ctx.fillStyle = `rgba(239, 68, 68, ${t.life / 100})`; // Red fading
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Rings
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        gameLoopId = requestAnimationFrame(loop);
    }

    spawnTarget();
    loop();
}

// ==========================================
// GAME 3: KNIFE MASTER (Canvas)
// ==========================================
function initKnifeGame() {
    container.innerHTML = '<canvas id="gameCanvas"></canvas>';
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const log = { x: canvas.width / 2, y: 200, r: 60, angle: 0 };
    const knives = [];
    let currentKnife = { x: canvas.width / 2, y: canvas.height - 100, state: 'ready' };
    score = 0;

    function throwKnife() {
        if (currentKnife.state === 'ready') {
            currentKnife.state = 'flying';
        }
    }

    window.addEventListener('keydown', (e) => { if (e.code === 'Space') throwKnife(); });
    canvas.addEventListener('mousedown', throwKnife);

    function loop() {
        if (!isPlaying) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update Log
        log.angle += 0.05;

        // Draw Log
        ctx.save();
        ctx.translate(log.x, log.y);
        ctx.rotate(log.angle);
        ctx.fillStyle = "#8B4513"; // Brown
        ctx.beginPath();
        ctx.arc(0, 0, log.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw stuck knives
        knives.forEach(k => {
            const knifeAngle = log.angle + k.angleOffset;
            const kx = log.x + Math.cos(knifeAngle) * log.r;
            const ky = log.y + Math.sin(knifeAngle) * log.r;
            
            ctx.save();
            ctx.translate(kx, ky);
            ctx.rotate(knifeAngle + Math.PI/2);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(-5, 0, 10, 40); // Handle sticking out
            ctx.restore();
        });

        // Update & Draw Current Knife
        if (currentKnife.state === 'flying') {
            currentKnife.y -= 15;
            if (currentKnife.y <= log.y + log.r) {
                // Hit logic
                const hitAngle = Math.PI / 2; // Bottom hit relative to log is 90 deg?
                // Simplified: Just attach it
                knives.push({ angleOffset: -log.angle + Math.PI/2 });
                currentKnife = { x: canvas.width / 2, y: canvas.height - 100, state: 'ready' };
                score++;
                scoreDisplay.innerText = "Score: " + score;
            }
        }

        ctx.fillStyle = "#fff";
        ctx.fillRect(currentKnife.x - 5, currentKnife.y, 10, 60);

        gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// GAME 4: STORY MODE (Text)
// ==========================================
function initStoryGame() {
    container.innerHTML = `
        <div class="story-container" style="display:block;">
            <div id="storyText" class="story-text"></div>
            <div id="storyChoices" class="choices"></div>
        </div>
    `;
    
    const storyData = {
        start: {
            text: "It is July 2024. The streets of Dhaka are heating up. You are a student at Dhaka University. The quota reform movement is calling for a march. What do you do?",
            choices: [
                { text: "Join the March", next: "march" },
                { text: "Stay in the Dorm", next: "dorm" }
            ]
        },
        march: {
            text: "You join thousands of students at Shahbag. The atmosphere is electric but tense. Police lines are forming ahead. The chanting grows louder.",
            choices: [
                { text: "Lead a chant", next: "chant" },
                { text: "Hold the line", next: "hold" }
            ]
        },
        dorm: {
            text: "You stay behind. News spreads of clashes. You feel a pang of regret but you are safe. Suddenly, internet services are cut off.",
            choices: [
                { text: "Try to find a radio", next: "radio" },
                { text: "Go outside to check", next: "march" }
            ]
        },
        chant: {
            text: "Your voice rallies those around you! 'Quota na Medha? Medha Medha!' The crowd surges forward peacefully.",
            choices: [
                { text: "Continue the story...", next: "start" } // Loop for demo
            ]
        },
        // ... simple loop for demo
        hold: { text: "You stand firm.", choices: [{ text: "Restart", next: "start" }] },
        radio: { text: "Static noise only.", choices: [{ text: "Restart", next: "start" }] }
    };

    function renderNode(nodeId) {
        const node = storyData[nodeId] || storyData['start'];
        const textEl = document.getElementById('storyText');
        const choicesEl = document.getElementById('storyChoices');
        
        textEl.innerText = node.text;
        choicesEl.innerHTML = '';
        
        node.choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = c.text;
            btn.onclick = () => renderNode(c.next);
            choicesEl.appendChild(btn);
        });
    }

    renderNode('start');
}
