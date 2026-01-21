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

    // 4. Materials
    const matLibrary = {
        grass: new THREE.MeshStandardMaterial({ color: 0x5da642 }),
        dirt: new THREE.MeshStandardMaterial({ color: 0x8b5a2b }),
        stone: new THREE.MeshStandardMaterial({ color: 0x757575 }),
        wood: new THREE.MeshStandardMaterial({ color: 0x5c4033 }),
        brick: new THREE.MeshStandardMaterial({ color: 0xa04030 })
    };
    let currentMat = 'grass';

    // 5. Instanced Mesh Management
    const MAX_INSTANCES = 10000;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const meshes = {};
    const instanceData = {}; 

    // Sound FX Generator
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playSound(type) {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        if (type === 'break') { // Low thud
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        } else { // High pop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        }
    }

    Object.keys(matLibrary).forEach(key => {
        const mesh = new THREE.InstancedMesh(geo, matLibrary[key], MAX_INSTANCES);
        mesh.count = 0; 
        mesh.castShadow = true; // Re-enabled for visuals
        mesh.receiveShadow = true;
        scene.add(mesh);
        meshes[key] = mesh;
    });

    // Outline / Highlight Box
    const outlineGeo = new THREE.BoxGeometry(1.01, 1.01, 1.01);
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.5 });
    const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
    outlineMesh.visible = false;
    scene.add(outlineMesh);

    const dummy = new THREE.Object3D();

    function setBlock(x, y, z, matKey) {
        // ... (existing setBlock logic)
        const key = `${x},${y},${z}`;
        if (instanceData[key]) return;

        const mesh = meshes[matKey];
        if (mesh.count >= MAX_INSTANCES) return;

        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(mesh.count, dummy.matrix);
        
        instanceData[key] = { mat: matKey, id: mesh.count };
        mesh.count++;
        mesh.instanceMatrix.needsUpdate = true;
        playSound('place');
    }

    function removeBlock(x, y, z) {
        // ... (existing removeBlock logic)
        const key = `${x},${y},${z}`;
        const data = instanceData[key];
        if (!data) return;

        const mesh = meshes[data.mat];
        const lastId = mesh.count - 1;

        if (data.id !== lastId) {
            const lastMatrix = new THREE.Matrix4();
            mesh.getMatrixAt(lastId, lastMatrix);
            mesh.setMatrixAt(data.id, lastMatrix);
            const lastPos = new THREE.Vector3().setFromMatrixPosition(lastMatrix);
            const lastKey = `${lastPos.x},${lastPos.y},${lastPos.z}`;
            instanceData[lastKey].id = data.id;
        }

        mesh.count--;
        mesh.instanceMatrix.needsUpdate = true;
        delete instanceData[key];
        playSound('break');
    }

    // ... (World Gen remains same)

    // Highlight Logic
    function updateHighlight() {
        raycaster.setFromCamera(center, camera);
        const intersectObjects = Object.values(meshes);
        const intersects = raycaster.intersectObjects(intersectObjects);
        
        if (intersects.length > 0 && intersects[0].distance < 8) { // Max reach 8
            const i = intersects[0];
            const matrix = new THREE.Matrix4();
            i.object.getMatrixAt(i.instanceId, matrix);
            const pos = new THREE.Vector3().setFromMatrixPosition(matrix);
            outlineMesh.position.copy(pos);
            outlineMesh.visible = true;
        } else {
            outlineMesh.visible = false;
        }
    }

    // ... (Controls & Physics setup)

    // Animation Loop with Day/Night
    let sunAngle = 0;
    
    const animate = () => {
        if (!isPlaying) return;
        requestAnimationFrame(animate);

        const time = performance.now();
        const delta = (time - prevTime) / 1000;
        prevTime = time;

        // Day/Night Cycle
        sunAngle += delta * 0.1; // Slow rotation
        sun.position.x = Math.cos(sunAngle) * 50;
        sun.position.y = Math.sin(sunAngle) * 50;
        sun.position.z = 20;
        // Sky color change
        const intensity = Math.max(0, Math.sin(sunAngle));
        ambient.intensity = 0.2 + intensity * 0.6;
        scene.background.setHSL(0.6, 0.5, intensity * 0.5 + 0.1);

        if (isLocked) {
            // Physics (Same as before)
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
                
                // Walking Bobbing
                if (moveForward || moveBackward || moveLeft || moveRight) {
                    camera.position.y += Math.sin(time * 0.015) * 0.05;
                }
            }
            
            updateHighlight();
        }
        
        renderer.render(scene, camera);
    };
    animate();


    // Generate Floor (20x20)
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

    // 6. Controls
    let isLocked = false;
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const PI_2 = Math.PI / 2;

    container.addEventListener('click', () => { if(!isLocked) container.requestPointerLock(); });
    document.addEventListener('pointerlockchange', () => isLocked = (document.pointerLockElement === container));
    document.addEventListener('mousemove', (event) => {
        if (!isLocked) return;
        euler.setFromQuaternion(camera.quaternion);
        euler.y -= event.movementX * 0.002;
        euler.x -= event.movementY * 0.002;
        euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
        camera.quaternion.setFromEuler(euler);
    });

    // 7. Movement & Physics
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let velocity = new THREE.Vector3();
    let canJump = false;
    let prevTime = performance.now();

    const onKeyDown = (e) => {
        switch (e.code) {
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
