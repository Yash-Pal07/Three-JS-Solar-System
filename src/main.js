import * as THREE from "three";
import gsap from "gsap";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 9;

const loader = new RGBELoader();
loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloppenheim_02_puresky_1k.hdr",
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = environmentMap;
    //   scene.background = environmentMap;
  }
);
// Create a large background sphere for stars
const starTextureLoader = new THREE.TextureLoader();
const bgGeometry = new THREE.SphereGeometry(50, 64, 64);
const starTexture = starTextureLoader.load('./stars.jpg');
starTexture.colorSpace = THREE.SRGBColorSpace;


const bgMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  side: THREE.BackSide // Ensure the texture is visible from inside
});
bgMaterial.transparent = true;
bgMaterial.opacity = 0.7 ;

const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bgSphere);

const radius = 1.3;
const orbitRadius = 4.2;
const segments = 64;
const colors = [0x00ff00, 0x0000ff, 0xff0000, 0xffff00];
const spheres = new THREE.Group();
const textures = [
    "./csilla/color.png",
    "./earth/map.jpg",
    "./venus/map.jpg",
    "./volcanic/color.png",
];
// Create a cube
const spheremesh = [];
for (let i = 0; i < 4; i++) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;
//   material.map = texture;
  const material = new THREE.MeshPhysicalMaterial({map:texture});
  const sphere = new THREE.Mesh(geometry, material);
  spheres.add(sphere);
  spheremesh.push(sphere);
  const angle = (i / 4) * Math.PI * 2;
  sphere.position.x = Math.cos(angle) * orbitRadius;
  sphere.position.z = Math.sin(angle) * orbitRadius;
}
scene.add(spheres);
spheres.rotation.x = 0.1;
spheres.position.y = -0.8;

// setInterval(() => {
//   gsap.to(spheres.rotation, {
//     y: `+=${Math.PI / 2}`,
//     duration: 2,
//     ease: "power1.inOut",
//   });
// }, 2500);

// Renderer setup
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  for(let i = 0; i < spheremesh.length; i++){
    spheremesh[i].rotation.y = clock.getElapsedTime() *0.02;
  }
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener("resize", () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


let lastScrollTime = 0;
const scrollThrottleDelay = 2000; // 2 seconds
let scrollcount = 0;
window.addEventListener('wheel', (event) => {
  const currentTime = Date.now();
  
  if (currentTime - lastScrollTime >= scrollThrottleDelay) {
    // Your wheel event handling code here
    console.log('Wheel event triggered');
    // Update the last scroll time
    lastScrollTime = currentTime;
    const direction = event.deltaY > 0 ? 'down' : 'up';
    
    const headings = document.querySelectorAll('.heading');
    scrollcount = (scrollcount + 1) % 4;
    console.log(scrollcount);
    
    gsap.to(headings,{
      y:`-=${100}%`,
      duration:1,
      ease:'power2.inOut'
    });

    gsap.to(spheres.rotation,{
      y:`-=${Math.PI/2}%`,
      duration:1,
      ease:'power2.inOut'
    })

    if(scrollcount === 0){
      gsap.to(headings,{
        duration:1,
        y:`0`,  
        ease:'power2.inOut'
      });
    }
  }
});
