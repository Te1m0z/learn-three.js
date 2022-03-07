import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement);

let Mesh;
let light;

function init() {
    scene.background = new THREE.Color('green');
    camera.position.set(0, 0, 3);

    controls.minPolarAngle = 0.8;
    controls.maxPolarAngle = 2.5;
    controls.maxDistance = 3.5;
    controls.minDistance = 1.8;
    // controls.minAzimuthAngle = -2;
    // controls.maxAzimuthAngle = 4;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function setLight() {
    light = new THREE.AmbientLight(0xFFFFFF); // soft white light
    scene.add(light);
}

function loadGLTF() {
    let balloonLoader = new GLTFLoader();

    balloonLoader.load('./model.gltf', (gltf) => {
        Mesh = gltf.scene;
        Mesh.position.y = -1;
        scene.add(Mesh);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (Mesh && Mesh.rotation) {
        Mesh.rotation.y -= 0.005;
    }
    controls.update();
    renderer.render(scene, camera);
}

init();
setLight();
loadGLTF();
animate();