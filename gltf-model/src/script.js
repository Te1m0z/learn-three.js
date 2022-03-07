import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const div = document.getElementById('preview');


const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(40, div.clientWidth / div.clientHeight, 1, 100);
const scene = new THREE.Scene();
// const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
const loader = new GLTFLoader();


let Mesh;
let light;
let mixer = new THREE.AnimationMixer(Mesh);
let dt;

function init() {
    scene.background = new THREE.Color('grey');
    camera.position.set(0, 0, 4);

    // controls.minPolarAngle = 0.8;
    // controls.maxPolarAngle = 2.5;
    // controls.maxDistance = 3.5;
    // controls.minDistance = 1.8;
    renderer.setSize(div.clientWidth, div.clientHeight);
    div.appendChild(renderer.domElement);
}

function setLight() {
    light = new THREE.AmbientLight(0xFFFFFF, 1); // soft white light
    scene.add(light);
}

function loadGLTF() {
    loader.load('./book.gltf', (model) => {
        Mesh = model.scene;
        Mesh.rotation.y = -1;
        // mixer = new THREE.AnimationMixer(Mesh);
        // mixer.clipAction(model.animations[1]).play();
        scene.add(Mesh);
    }, animate);
}

var amplitude = 10;
var period = 200;
let curRat;
let dir = 'left';

function animate() {
    if (Mesh && Mesh.rotation) {
        Mesh.rotation.y -= 0.0007;
    }
    // mixer.update(clock.getDelta());
    // controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function addGui() {
    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }
        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }

    const gui = new dat.GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
}

init();
setLight();
loadGLTF();
// addGui();