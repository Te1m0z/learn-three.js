import * as THREE from "three";
import { TubeGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

let texts = [],
  tubeGeometry,
  camera,
  pos,
  controls,
  scene,
  renderer,
  geometry,
  geometry1,
  material,
  plane,
  text1,
  tex2;

let destination = { x: 0, y: 0 };
let textures = [];

const config = {
  isRunCameraInTube: true,
};

class CustomSinCurve extends THREE.Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = Math.cos(2 * Math.PI * t);
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0.2 * Math.sin(10 * Math.PI * t);

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGL1Renderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  var container = document.getElementById("container");
  container.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001,
    100
  );
  camera.position.set(0, 0, 20);

  controls = new OrbitControls(camera, renderer.domElement);

  const path = new CustomSinCurve(10);
  tubeGeometry = new THREE.TubeGeometry(path, 200, 1, 8, false);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00e7eb,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load("map.png"),
  });

  material.map.wrapS = THREE.RepeatWrapping;
  material.map.wrapT = THREE.RepeatWrapping;

  material.map.repeat.set(10, 1);

  const mesh = new THREE.Mesh(tubeGeometry, material);

  scene.add(mesh);

  const loader = new FontLoader();
  const font = loader.load(
    "Monoid_Regular.json",
    function (font) {
      const textgeometry = new TextGeometry("Site Creative", {
        font: font,
        size: 0.13,
        height: 0.01,
      });

      textgeometry.center();

      let textmaterial = new THREE.MeshBasicMaterial({
        color: 0xeb9600,
      });

      let textmesh = new THREE.Mesh(textgeometry, textmaterial);

      textmesh.position.copy(tubeGeometry.parameters.path.getPointAt(0.5));

      for (let i = 0; i < 6; i++) {
        let copy = textmesh.clone();
        texts.push(copy);
        scene.add(copy);
        copy.position.copy(tubeGeometry.parameters.path.getPointAt(i * 0.1));
      }
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (err) {
      console.log("An error happened");
    }
  );

  resize();
}

window.addEventListener("resize", resize);

function resize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;

  camera.updateProjectionMatrix();
}

let looptime = 30 * 1000; // все потраченное время
let cur;
let counterTexts = 0;

function timeHandle(time) {
  if (time % (2000 + counterTexts * 3000) < 0.1 && time !== 0) {
    cur = time;
    counterTexts += 1;
  }
  return time < cur + 400 ? time + 5 : time + 20;
}

let time = 0;

function animate() {
  controls.update();
  if (config.isRunCameraInTube) {
    time = timeHandle(time);
    let t = (time % looptime) / looptime; // положение на кривой, от 0 до 1
    let pos = tubeGeometry.parameters.path.getPointAt(t);
    let posTo = tubeGeometry.parameters.path.getPointAt((t + 0.01) % 1);

    camera.position.copy(pos);
    camera.lookAt(posTo);

    texts.forEach((t) => {
      t.quaternion.copy(camera.quaternion);
    });
  }

  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();
