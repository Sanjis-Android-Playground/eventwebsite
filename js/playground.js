// ... (Previous game logic)

// --- VOXEL (MINECRAFT CLONE) ---
function initVoxelGame() {
    if (typeof THREE === 'undefined') return alert("Three.js not loaded");

    // 1. Setup UI
    document.getElementById('crosshair').style.display = 'block';
    document.getElementById('hotbar').style.display = 'flex';
    document.getElementById('mc-controls-hint').style.display = 'block';
    
    // 2. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: false }); // False for retro feel
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(50, 100, 50);
    sun.castShadow = true;
    scene.add(sun);

    // 4. Materials
    const matLibrary = {
        grass: new THREE.MeshStandardMaterial({ color: 0x5da642 }),
        dirt: new THREE.MeshStandardMaterial({ color: 0x8b5a2b }),
        stone: new THREE.MeshStandardMaterial({ color: 0x757575 }),
        wood: new THREE.MeshStandardMaterial({ color: 0x5c4033 }),
        brick: new THREE.MeshStandardMaterial({ color: 0xa04030 })
    };
    let currentMat = 'grass';

    // 5. World Generation (Chunks)
    const objects = []; // For raycasting
    const chunks = {};
    const geo = new THREE.BoxGeometry(1, 1, 1);

    function addBlock(x, y, z, matKey) {
        const mat = matLibrary[matKey];
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        objects.push(mesh);
        return mesh;
    }

    // Generate Floor (10x10)
    for(let x=-10; x<10; x++) {
        for(let z=-10; z<10; z++) {
            addBlock(x, 0, z, 'grass');
            if(Math.random() > 0.9) addBlock(x, 1, z, 'stone'); // Random rocks
            if(Math.random() > 0.95) { // Random trees
                addBlock(x, 1, z, 'wood');
                addBlock(x, 2, z, 'wood');
                addBlock(x, 3, z, 'grass'); // Leaves
            }
        }
    }

    // 6. Controls (Pointer Lock)
    // Minimal PointerLock implementation without external imports
    let isLocked = false;
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const PI_2 = Math.PI / 2;

    container.addEventListener('click', () => {
        if(!isLocked) container.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
        isLocked = (document.pointerLockElement === container);
    });

    document.addEventListener('mousemove', (event) => {
        if (!isLocked) return;
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;
        euler.setFromQuaternion(camera.quaternion);
        euler.y -= movementX * 0.002;
        euler.x -= movementY * 0.002;
        euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
        camera.quaternion.setFromEuler(euler);
    });

    // 7. Physics & Movement
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let canJump = false;
    let velocity = new THREE.Vector3();
    let direction = new THREE.Vector3();
    let prevTime = performance.now();

    const onKeyDown = (event) => {
        switch (event.code) {
            case 'ArrowUp': case 'KeyW': moveForward = true; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
            case 'ArrowDown': case 'KeyS': moveBackward = true; break;
            case 'ArrowRight': case 'KeyD': moveRight = true; break;
            case 'Space': if (canJump) velocity.y += 10; canJump = false; break;
            case 'Digit1': selectMat('grass'); break;
            case 'Digit2': selectMat('dirt'); break;
            case 'Digit3': selectMat('stone'); break;
            case 'Digit4': selectMat('wood'); break;
            case 'Digit5': selectMat('brick'); break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'ArrowUp': case 'KeyW': moveForward = false; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
            case 'ArrowDown': case 'KeyS': moveBackward = false; break;
            case 'ArrowRight': case 'KeyD': moveRight = false; break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // 8. Raycasting (Building/Breaking)
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0); // Center of screen

    const handleMouseClick = (event) => {
        if(!isLocked || !isPlaying) return;
        
        // 0 = Left (Build), 2 = Right (Break) - mapped to Shift for simplicity on web
        const isPlace = event.button === 0 && !event.shiftKey;
        const isBreak = event.button === 2 || (event.button === 0 && event.shiftKey);

        raycaster.setFromCamera(center, camera);
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            if (isBreak) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
            } else if (isPlace) {
                // Place adjacent to face
                const p = intersect.point.add(intersect.face.normal.multiplyScalar(0.5)).floor().addScalar(0.5);
                addBlock(p.x, p.y, p.z, currentMat);
            }
        }
    };
    document.addEventListener('mousedown', handleMouseClick);

    // 9. Hotbar Logic
    const slots = document.querySelectorAll('.slot');
    function selectMat(name) {
        currentMat = name;
        slots.forEach(s => s.classList.remove('active'));
        document.querySelector(`.slot[data-mat="${name}"]`).classList.add('active');
    }
    slots.forEach(s => s.onclick = () => selectMat(s.getAttribute('data-mat')));

    // 10. Animation Loop
    camera.position.y = 2; // Eyes height

    const animate = () => {
        if (!isPlaying) return;
        requestAnimationFrame(animate);

        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        if (isLocked) {
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 2.0 * delta; // Gravity

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;

            // Apply movement (Simple Euler move)
            camera.translateX(-velocity.x * delta);
            camera.translateZ(-velocity.z * delta);
            camera.position.y += velocity.y * delta;

            // Simple floor collision
            if (camera.position.y < 2.5) {
                velocity.y = 0;
                camera.position.y = 2.5;
                canJump = true;
            }
        }

        prevTime = time;
        renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    window.voxelCleanup = () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        document.removeEventListener('mousedown', handleMouseClick);
        document.exitPointerLock();
        document.getElementById('crosshair').style.display = 'none';
        document.getElementById('hotbar').style.display = 'none';
        document.getElementById('mc-controls-hint').style.display = 'none';
        // Dispose Three.js objects
        scene.clear();
        renderer.dispose();
    };
}

// ... (Rest of existing games) ...
// (I will preserve the previous shooter, knife, etc. implementations, 
// just updating the top part of the file with the new voxel engine)
let currentGame = null;
// ... (Include all previous code below this new initVoxelGame function)
