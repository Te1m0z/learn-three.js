import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';


let ww = window.innerWidth,
    wh = window.innerHeight,
    Mesh,
    mixer = new THREE.AnimationMixer(Mesh);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
const camera = new THREE.PerspectiveCamera(75, ww / wh, 0.1, 500);
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

let gr = new THREE.Group();


function init() {
    // scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color('white');
    camera.position.set(1, 1, 1);
    scene.environment = 'city';
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 7;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(ww, wh);
    document.body.appendChild(renderer.domElement);
}

function setLight() {
    let light = new THREE.AmbientLight();
    light.intensity = 1;
    light.castShadow = true;
    scene.add(light);
    let spot = new THREE.SpotLight();
    spot.intensity = 0.5;
    spot.angle = 1;
    spot.castShadow = true;
    spot.penumbra = 1;
    spot.position.set(10, 15, 10);
    scene.add(spot);
    let amb = new THREE.DirectionalLight('white', 2);
    amb.castShadow = true;
    scene.add(amb)
}

function loadGLTF() {
    loader.load('model_test1.glb', (gltf) => {
        Mesh = gltf.scene;
        const box = new THREE.Box3().setFromObject(Mesh);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.x += (gltf.scene.position.x - center.x);
        gltf.scene.position.y += (gltf.scene.position.y - center.y);
        gltf.scene.position.z += (gltf.scene.position.z - center.z);
        Mesh.castShadow = true;
        mixer = new THREE.AnimationMixer(Mesh);
        mixer.clipAction(gltf.animations[1]).play();
        scene.add(Mesh);
    }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% model loaded');
        animate();
    }, (err) => {
        console.log(err);
    });
}

function animate() {
    mixer.update(clock.getDelta());
    controls.update();
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