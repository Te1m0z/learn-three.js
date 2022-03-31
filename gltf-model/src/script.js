import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui'

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


function init() {
    scene.add(new THREE.AxesHelper(100));
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

let light, spot, amb;

function setLight() {
    light = new THREE.AmbientLight();
    light.intensity = 1;
    // light.castShadow = true;
    scene.add(light);

    spot = new THREE.SpotLight();
    spot.intensity = 0.5;
    spot.angle = 1;
    spot.castShadow = true;
    spot.penumbra = 1;
    spot.position.set(10, 15, 10);
    scene.add(spot);
    
    amb = new THREE.DirectionalLight('white', 2);
    amb.castShadow = true;
    scene.add(amb)
}

function loadGLTF() {
    loader.load('catapulta.gltf', (gltf) => {
        Mesh = gltf.scene;
        const box = new THREE.Box3().setFromObject(Mesh);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.x += (gltf.scene.position.x - center.x);
        gltf.scene.position.z += (gltf.scene.position.z - center.z);
        Mesh.castShadow = true;
        mixer = new THREE.AnimationMixer(Mesh);
        mixer.clipAction(gltf.animations[1]).play(); 
        addGui(gltf.animations);
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

function addGui(anims) {
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

    const gui = new GUI();
    const lightFoler = gui.addFolder('Light');
    const animFoler = gui.addFolder('Animation');
    const ambFolder  = lightFoler.addFolder('AmbientLight');
    const spotFolder = lightFoler.addFolder('SpotLight');
    const dirFolder  = lightFoler.addFolder('DirectionalLight');
    
    ambFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    spotFolder.addColor(new ColorGUIHelper(spot, 'color'), 'value').name('color');
    dirFolder.addColor(new ColorGUIHelper(amb, 'color'), 'value').name('color');

    ambFolder.add(light, 'intensity', 0, 10, 0.1);
    ambFolder.add(light.position, 'x', -20, 20, 1);
    ambFolder.add(light.position, 'y', -20, 20, 1);
    ambFolder.add(light.position, 'z', -20, 20, 1);

    spotFolder.add(spot, 'intensity', 0, 10, 0.1);
    spotFolder.add(spot.position, 'x', -20, 20, 1);
    spotFolder.add(spot.position, 'y', -20, 20, 1);
    spotFolder.add(spot.position, 'z', -20, 20, 1);

    dirFolder.add(amb, 'intensity', 0, 10, 0.1);
    dirFolder.add(amb.position, 'x', -20, 20, 1);
    dirFolder.add(amb.position, 'y', -20, 20, 1);
    dirFolder.add(amb.position, 'z', -20, 20, 1);

    animFoler.add(mixer.clipAction(anims[1]), 'paused', true, false);
}

init();
setLight();
loadGLTF();