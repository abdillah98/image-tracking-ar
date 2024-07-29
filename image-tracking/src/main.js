import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';

// Inisialisasi dan setup Three.js, WebXR, dll.
let scene, camera, renderer, xrButton, reticle;

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Light
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Reticle
  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.05, 0.1, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  // Load 3D Model
  const loader = new GLTFLoader();
  loader.load('/public/assets/model.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.visible = false;
    scene.add(model);
    reticle.addEventListener('select', () => {
      model.position.setFromMatrixPosition(reticle.matrix);
      model.visible = true;
    });
  });

  // AR Button
  xrButton = document.getElementById('xr-button');
  xrButton.addEventListener('click', onXRButtonClicked);
}

function onXRButtonClicked() {
  navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] }).then(onSessionStarted);
}

function onSessionStarted(session) {
  renderer.xr.setSession(session);
  session.addEventListener('select', onSelect);
}

function onSelect(event) {
  reticle.visible = true;
}

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});

init();
