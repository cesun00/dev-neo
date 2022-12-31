import * as THREE from "three"

/**
 * Camera sit in (0,0,-10) and look at somewhere (x,y,-100)
 * 
 * Bars flys from (x,y,-300) to (x,y,0) for random x and y ranges in [-10,10]
 */

// ===================== scene ========================

const scene = new THREE.Scene();
const boxGeo = new THREE.BoxGeometry(.2, .2, 20)
const meshes = []

const LIM = 300;

function rangeRandom(b, e) {
    return b + ((e - b) * Math.random())
}

// for (const color of [0x39f5cc, 0xFFE66D, 0xffccff]) {
for (const color of [0x39fbcc]) {
    // for (const color of [0x101010]) {
    const mat = new THREE.MeshPhongMaterial({ color });
    while (meshes.length < 100) {
        const [x, y] = [rangeRandom(-10, 10), rangeRandom(-10, 10)];
        // if ((x < 1 && x > -1) || (y < 1 && y > -1))
        //     continue;
        const mesh = new THREE.Mesh(boxGeo, mat);
        mesh.position.set(x, y, rangeRandom(-LIM, 0));
        scene.add(mesh);
        meshes.push(mesh)
    }
}


scene.add(new THREE.AmbientLight('white', 1))
const light = new THREE.DirectionalLight('white', 4);
light.position.set(1, 1, 1);
scene.add(light);

// ===================== canvas and resize ========================

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor('white');

const cam = new THREE.PerspectiveCamera(75, 1 /*doesnt matter*/, .5, 200);
cam.position.z = -10

function handleResize() {
    const w = window.innerWidth * window.devicePixelRatio,
        h = window.innerHeight * window.devicePixelRatio;
    // const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
}

handleResize()
window.addEventListener("resize", handleResize);

let mouseX = .5, mouseY = .5;
document.addEventListener('mousemove', (ev) => {
    mouseX = ev.clientX / window.innerWidth;
    mouseY = ev.clientY / window.innerHeight;
});

function frame(time) {
    meshes.forEach(mesh => mesh.position.z = (mesh.position.z + 0.03 + LIM) % LIM - LIM);
    cam.lookAt(-10 + 20 * mouseX, 10 - 20 * mouseY, -100);
    renderer.render(scene, cam);
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
