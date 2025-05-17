import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 2000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap = true;
camera.position.set(0, 0, 0); // X, Y, Z


renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

//scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 0, 50);

const ambientLight = new THREE.AmbientLight(0xffffff, 3.2);
scene.add(pointLight, ambientLight);

// Helpers

 const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
 scene.add(lightHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar

const clayneTexture = new THREE.TextureLoader().load('clayne.png');

const clayne = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ map: clayneTexture }));

scene.add(clayne);

// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-20);

clayne.position.z = -5;
clayne.position.x = 0;

// Scroll Animation

let scrollTop = 0;
let revertRotation = false;

function moveCamera() {
  scrollTop = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  if (scrollTop < -200) {
    clayne.rotation.y += 0.01;
    clayne.rotation.z += 0.01;
    revertRotation = false;
  }

  if (scrollTop >= -200) {
    revertRotation = true;
  }

  camera.position.z = 50 + scrollTop * -0.01;
  camera.position.x = -10 + scrollTop * -0.0002;
  camera.rotation.y = scrollTop * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // Smoothly reset clayne rotation when scrolling up
  if (revertRotation) {
    clayne.rotation.x += (0 - clayne.rotation.x) * 0.05;
    clayne.rotation.y += (0 - clayne.rotation.y) * 0.05;
    clayne.rotation.z += (0 - clayne.rotation.z) * 0.05;
  }

  renderer.render(scene, camera);
}

animate();





// Smooth scrolling for navigation
document.querySelectorAll('.top-nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust offset based on your nav height
        behavior: 'smooth'
      });
    }
  });
});