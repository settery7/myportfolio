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
    .map(() => THREE.MathUtils.randFloatSpread(150));

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

//earth

const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const earthnormalTexture = new THREE.TextureLoader().load('earthnormal.jpg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(9, 44, 44),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthnormalTexture,
  })
);

scene.add(earth);
earth.position.set(-50, 0, -20);
// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 44, 44),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
moon.position.set(-30, 0, -20);


//mars
const marsTexture = new THREE.TextureLoader().load('mars.jpg');
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(7.2, 32, 32),
  new THREE.MeshStandardMaterial({ map: marsTexture })
);

mars.position.set(-100,-10, -20);
scene.add(mars);

//saturn

// Create Saturn (planet)
const saturnGeometry = new THREE.SphereGeometry(5, 32, 32);
const saturnTexture = new THREE.TextureLoader().load('saturn.jpg');
const saturnMaterial = new THREE.MeshStandardMaterial({ 
  map: saturnTexture,

});
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// Create Saturn's rings
const saturnRingGeometry = new THREE.RingGeometry(7, 12, 64);
const saturnRingTexture = new THREE.TextureLoader().load('saturnring.png');
const saturnRingMaterial = new THREE.MeshBasicMaterial({
  map: saturnRingTexture,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2; // Rotate to be horizontal
saturn.add(saturnRing); // Add as child of Saturn

// Position Saturn in your scene
saturn.position.set(-100, 30, -280);



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

  camera.position.z = 50 + scrollTop * -0.001;
  camera.position.x = -10 + scrollTop * -0.0001;
  camera.rotation.y = scrollTop * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  saturn.rotation.y += 0.005;
  moon.rotation.x += 0.005;

  mars.rotation.x += 0.005;
  mars.rotation.y += 0.0075;

  saturn.rotation.x += 0.005;
  saturn.rotation.y += 0.0075;

  earth.rotation.x -= 0.005;
  earth.rotation.y -= 0.0075;


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
