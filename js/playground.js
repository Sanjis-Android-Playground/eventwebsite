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
    
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = false; // Disabled shadows for performance
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 0.5);
    sun.position.set(50, 100, 50);
    scene.add(sun);

    // Save/Load System
    function saveWorld() {
        localStorage.setItem('voxelWorld', JSON.stringify(instanceData));
    }
    
    function loadWorld() {
        const saved = localStorage.getItem('voxelWorld');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const parts = key.split(',');
                setBlock(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]), data[key].mat);
            });
        } else {
            // Generate Floor (20x20) only if no save
            for(let x=-10; x<10; x++) {
                for(let z=-10; z<10; z++) {
                    setBlock(x, 0, z, 'grass');
                    if(Math.random() > 0.9) setBlock(x, 1, z, 'stone');
                    if(Math.random() > 0.95) {
                        setBlock(x, 1, z, 'wood');
                        setBlock(x, 2, z, 'wood');
                        setBlock(x, 3, z, 'grass');
                    }
                }
            }
        }
    }

    // 4. Materials (Expanded Palette)
    const matLibrary = {
        grass: new THREE.MeshStandardMaterial({ color: 0x5da642 }),
        dirt: new THREE.MeshStandardMaterial({ color: 0x8b5a2b }),
        stone: new THREE.MeshStandardMaterial({ color: 0x757575 }),
        wood: new THREE.MeshStandardMaterial({ color: 0x5c4033 }),
        leaves: new THREE.MeshStandardMaterial({ color: 0x3a5f0b }),
        sand: new THREE.MeshStandardMaterial({ color: 0xe6c288 }),
        water: new THREE.MeshStandardMaterial({ color: 0x40a4df, transparent: true, opacity: 0.8 }),
        snow: new THREE.MeshStandardMaterial({ color: 0xffffff }),
        brick: new THREE.MeshStandardMaterial({ color: 0xa04030 }),
        gold: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 })
    };
    let currentMat = 'grass';

    // ... (InstancedMesh setup remains same)

    // Improved World Generation (Pseudo-Biomes)
    // Simple noise function replacement for demo
    function noise(x, z) {
        return Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 + Math.sin(x * 0.3 + z * 0.2) * 1;
    }

    function generateWorld() {
        // Clear existing (if reload)
        Object.keys(instanceData).forEach(k => {
            const p = k.split(',');
            removeBlock(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]));
        });

        const size = 30; // 60x60 area
        for(let x = -size; x < size; x++) {
            for(let z = -size; z < size; z++) {
                let h = Math.floor(noise(x, z));
                let biome = 'grass';
                
                // Biome Logic
                if (h > 2) biome = 'snow'; // Peaks
                else if (h < -1) biome = 'sand'; // Lowlands/Desert
                
                // Base terrain
                for(let y = -2; y <= h; y++) {
                    let mat = (y === h) ? biome : (biome === 'sand' ? 'sand' : 'dirt');
                    if(y < h - 3) mat = 'stone';
                    setBlock(x, y, z, mat);
                }

                // Trees (Forest Biome)
                if (biome === 'grass' && Math.random() > 0.97) {
                    let treeH = 3 + Math.floor(Math.random() * 3);
                    for(let i=1; i<=treeH; i++) setBlock(x, h+i, z, 'wood');
                    // Leaves
                    for(let lx=-1; lx<=1; lx++) {
                        for(let lz=-1; lz<=1; lz++) {
                            for(let ly=0; ly<=1; ly++) {
                                if (lx===0 && lz===0 && ly===0) continue;
                                setBlock(x+lx, h+treeH+ly, z+lz, 'leaves');
                            }
                        }
                    }
                }
                
                // Cactus (Desert)
                if (biome === 'sand' && Math.random() > 0.98) {
                    setBlock(x, h+1, z, 'grass'); // Cactus green
                    setBlock(x, h+2, z, 'grass');
                }
            }
        }
    }

    // Call Gen if no save found
    const saved = localStorage.getItem('voxelWorld');
    if (saved) loadWorld();
    else generateWorld();

    // 6. Controls
    // ... (Rest of file)

    let isLocked = false;
    let isFlying = false; // Fly mode state
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const PI_2 = Math.PI / 2;

    // ... (rest of controls setup)

    // 7. Movement & Physics
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
    let velocity = new THREE.Vector3();
    let canJump = false;
    let prevTime = performance.now();

    const onKeyDown = (e) => {
        switch (e.code) {
            case 'ArrowUp': case 'KeyW': moveForward = true; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
            case 'ArrowDown': case 'KeyS': moveBackward = true; break;
            case 'ArrowRight': case 'KeyD': moveRight = true; break;
            case 'Space': 
                if(isFlying) moveUp = true;
                else if (canJump) { velocity.y += 10; canJump = false; }
                break;
            case 'ShiftLeft': if(isFlying) moveDown = true; break;
            case 'KeyF': isFlying = !isFlying; velocity.y = 0; break; // Toggle Fly
            case 'KeyK': saveToJSON(); break; // Export
            case 'KeyL': loadFromJSON(); break; // Import
            case 'Digit1': selectMat('grass'); break;
            case 'Digit2': selectMat('dirt'); break;
            case 'Digit3': selectMat('stone'); break;
            case 'Digit4': selectMat('wood'); break;
            case 'Digit5': selectMat('brick'); break;
        }
    };
    const onKeyUp = (e) => {
        switch (e.code) {
            case 'ArrowUp': case 'KeyW': moveForward = false; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
            case 'ArrowDown': case 'KeyS': moveBackward = false; break;
            case 'ArrowRight': case 'KeyD': moveRight = false; break;
            case 'Space': moveUp = false; break;
            case 'ShiftLeft': moveDown = false; break;
        }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Export/Import Logic
    function saveToJSON() {
        const data = JSON.stringify(instanceData);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'voxel-world.json';
        a.click();
    }

    function loadFromJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                const data = JSON.parse(event.target.result);
                // Clear current
                Object.keys(instanceData).forEach(k => {
                    const parts = k.split(',');
                    removeBlock(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
                });
                // Load new
                Object.keys(data).forEach(key => {
                    const parts = key.split(',');
                    setBlock(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]), data[key].mat);
                });
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // ... (rest of logic)

    const animate = () => {
        if (!isPlaying) return;
        requestAnimationFrame(animate);

        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        if (isLocked) {
            // Friction
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            
            if(isFlying) {
                velocity.y -= velocity.y * 10.0 * delta; // Air friction
            } else {
                velocity.y -= 9.8 * 2.0 * delta; // Gravity
            }

            const direction = new THREE.Vector3();
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z -= direction.z * (isFlying ? 100 : 50.0) * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * (isFlying ? 100 : 50.0) * delta;
            
            if (isFlying) {
                if (moveUp) velocity.y += 50.0 * delta;
                if (moveDown) velocity.y -= 50.0 * delta;
            }

            camera.translateX(-velocity.x * delta);
            camera.translateZ(-velocity.z * delta);
            camera.position.y += velocity.y * delta;

            if (!isFlying && camera.position.y < 2.5) {
                velocity.y = 0;
                camera.position.y = 2.5;
                canJump = true;
            }
        }
        prevTime = time;
        renderer.render(scene, camera);
    };

    const onKeyUp = (e) => {
        switch (e.code) {
            case 'ArrowUp': case 'KeyW': moveForward = false; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
            case 'ArrowDown': case 'KeyS': moveBackward = false; break;
            case 'ArrowRight': case 'KeyD': moveRight = false; break;
        }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // 8. Raycasting (Optimized for InstancedMesh)
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);

    const handleMouseClick = (event) => {
        if(!isLocked || !isPlaying) return;
        const isPlace = event.button === 0 && !event.shiftKey;
        const isBreak = event.button === 2 || (event.button === 0 && event.shiftKey);

        raycaster.setFromCamera(center, camera);
        // Intersect against all InstancedMeshes
        const intersectObjects = Object.values(meshes);
        const intersects = raycaster.intersectObjects(intersectObjects);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            
            // Get position of the instance
            const matrix = new THREE.Matrix4();
            intersect.object.getMatrixAt(intersect.instanceId, matrix);
            const pos = new THREE.Vector3().setFromMatrixPosition(matrix);

            if (isBreak) {
                removeBlock(pos.x, pos.y, pos.z);
            } else if (isPlace) {
                const p = pos.add(intersect.face.normal);
                setBlock(p.x, p.y, p.z, currentMat);
            }
        }
    };
    document.addEventListener('mousedown', handleMouseClick);

    // 9. Hotbar
    const slots = document.querySelectorAll('.slot');
    function selectMat(name) {
        currentMat = name;
        slots.forEach(s => s.classList.remove('active'));
        document.querySelector(`.slot[data-mat="${name}"]`).classList.add('active');
    }
    slots.forEach(s => s.onclick = () => selectMat(s.getAttribute('data-mat')));

    camera.position.y = 2;

    const animate = () => {
        if (!isPlaying) return;
        requestAnimationFrame(animate);

        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        if (isLocked) {
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 2.0 * delta; 

            const direction = new THREE.Vector3();
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;

            camera.translateX(-velocity.x * delta);
            camera.translateZ(-velocity.z * delta);
            camera.position.y += velocity.y * delta;

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

    window.voxelCleanup = () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        document.removeEventListener('mousedown', handleMouseClick);
        document.exitPointerLock();
        document.getElementById('crosshair').style.display = 'none';
        document.getElementById('hotbar').style.display = 'none';
        document.getElementById('mc-controls-hint').style.display = 'none';
        scene.clear();
        renderer.dispose();
    };
}
