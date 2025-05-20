import "./style.css";
import "./projects.css"; // Add this line

import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap = true;
camera.position.set(0, 0, 0); // X, Y, Z

renderer.render(scene, camera);

const loader = new GLTFLoader();
let model = null;
let modelInitialized = false;

loader.load(
  "models/TheeBee.gltf",
  (gltf) => {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(-5, -6, 0); // Starting position
    model.rotation.set(0, 0, 0);
    scene.add(model);
    modelInitialized = true;
    // model.lookAt(camera.position);
    console.log("Model loaded!"); // Should see this before animation starts
  },
  undefined,
  (error) => console.error("Error loading model:", error)
);
// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 0, 50);

const ambientLight = new THREE.AmbientLight(0xffffff, 3.2);
scene.add(pointLight, ambientLight);

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
//  const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper);

//const controls = new OrbitControls(camera, renderer.domElement);

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

Array(1000).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("space1.jpg", (texture) => {
  texture.minFilter = THREE.LinearFilter; // or THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // For better quality
  scene.background = texture;
});

// Avatar

const clayneTexture = new THREE.TextureLoader().load("clayne.png");

const clayne = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ map: clayneTexture })
);

scene.add(clayne);

//earth

const earthTexture = new THREE.TextureLoader().load("earth.jpg");
const earthnormalTexture = new THREE.TextureLoader().load("earthnormal.jpg");

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

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 44, 44),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
moon.position.set(-30, 0, -20);

//mars
const marsTexture = new THREE.TextureLoader().load("mars.jpg");
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(7.2, 32, 32),
  new THREE.MeshStandardMaterial({ map: marsTexture })
);

mars.position.set(-200, -10, -20);
scene.add(mars);

const jupiterTexture = new THREE.TextureLoader().load("jupiter.jpg");
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(20, 32, 32),
  new THREE.MeshStandardMaterial({ map: jupiterTexture })
);

jupiter.position.set(-300, -10, -150);
scene.add(jupiter);

//uranus
const uranusTexture = new THREE.TextureLoader().load("uranus.jpg");
const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 32),
  new THREE.MeshStandardMaterial({ map: uranusTexture })
);

uranus.position.set(-500, 9, -160);
scene.add(uranus);

//neptune
const neptuneTexture = new THREE.TextureLoader().load("neptune.jpg");
const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 32),
  new THREE.MeshStandardMaterial({ map: neptuneTexture })
);

neptune.position.set(-900, 9, -160);
scene.add(neptune);

//saturn

// Create Saturn (planet)
const saturnGeometry = new THREE.SphereGeometry(12, 32, 32);
const saturnTexture = new THREE.TextureLoader().load("saturn.jpg");
const saturnMaterial = new THREE.MeshStandardMaterial({
  map: saturnTexture,
});
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// Create Saturn's rings
const saturnRingGeometry = new THREE.RingGeometry(20, 15, 64);
const saturnRingTexture = new THREE.TextureLoader().load("saturnring.png");
const saturnRingMaterial = new THREE.MeshBasicMaterial({
  map: saturnRingTexture,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8,
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2; // Rotate to be horizontal
saturn.add(saturnRing); // Add as child of Saturn

// Position Saturn in your scene
saturn.position.set(-100, 30, -280);

clayne.position.z = -5;
clayne.position.x = 0;

// Scroll Animationf

let scrollTop = 0;
let revertRotation = false;

function moveCamera() {
  scrollTop = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jupiter.rotation.x -= 0.05;
  jupiter.rotation.y -= 0.075;
  jupiter.rotation.z -= 0.05;

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

let modelMovingLeft = true;
const modelMoveSpeed = 0.5; // Adjust speed as needed
const leftBound = -100;
const rightBound = -20;

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    // Calculate target rotation (in radians)
    const targetRotationY = modelMovingLeft
      ? (Math.PI * -50) / 180
      : (Math.PI * 100) / 180; // FIXED DIRECTIONS

    // Smoothly rotate model to face movement direction first
    model.rotation.y += (targetRotationY - model.rotation.y) * 0.1;

    // Only move after mostly facing the right direction
    if (Math.abs(targetRotationY - model.rotation.y) < 0.2) {
      // Move model in current direction
      model.position.x += modelMovingLeft ? -modelMoveSpeed : modelMoveSpeed;

      // Reverse direction when reaching bounds
      if (model.position.x <= leftBound) {
        modelMovingLeft = false;
      } else if (model.position.x >= rightBound) {
        modelMovingLeft = true;
      }
    }

    // Optional: Add slight bounce effect at bounds
    if (model.position.x <= leftBound || model.position.x >= rightBound) {
      model.position.y = -6 + Math.sin(Date.now() * 0.01) * 0.5;
    } else {
      model.position.y = -6; // Reset to original Y position
    }
  }

  saturn.rotation.y += 0.005;
  moon.rotation.x += 0.005;

  mars.rotation.x += 0.005;
  mars.rotation.y += 0.0075;

  jupiter.rotation.x -= 0.005;
  jupiter.rotation.y -= 0.0075;

  saturn.rotation.x += 0.005;
  saturn.rotation.y += 0.0075;

  uranus.rotation.x += 0.005;
  uranus.rotation.y += 0.0075;

  neptune.rotation.x += 0.005;
  neptune.rotation.y += 0.0075;

  earth.rotation.x -= 0.005;
  earth.rotation.y -= 0.0075;

  // Smoothly reset clayne rotation when scrolling up
  if (revertRotation) {
    clayne.rotation.x += (0 - clayne.rotation.x) * 0.05;
    clayne.rotation.y += (0 - clayne.rotation.y) * 0.05;
    clayne.rotation.z += (0 - clayne.rotation.z) * 0.05;
  }

  console.log("Model state:", model); // Should show null → THREE.Group

  renderer.render(scene, camera);
}

animate();

// Smooth scrolling for navigation
document.querySelectorAll(".top-nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust offset based on your nav height
        behavior: "smooth",
      });
    }
  });
});

import emailjs from "@emailjs/browser";

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

document.querySelector(".contact-form form").addEventListener("submit", (e) => {
  e.preventDefault();

  emailjs.sendForm(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    e.target
  ).then(
    () => {
      alert("Message sent successfully!");
      e.target.reset();
    },
    (error) => {
      alert("Failed to send message: " + error.text);
    }
  );
});


document.getElementById('viewResume').addEventListener('click', function() {
  // Replace with your actual resume file path
  window.open('/resume.pdf', '_blank');
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});