import * as THREE from "./three.js/build/three.module.js";
import { OrbitControls } from "./three.js/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
const normalCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbitCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const control = new OrbitControls(orbitCamera, renderer.domElement)

let currentCamera = normalCamera;

orbitCamera.position.set(0, 25, 0);
orbitCamera.lookAt(0, 0, 0);

normalCamera.position.set(15, 15, 0);
normalCamera.lookAt(0, 0, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createBox(w, h, d) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createPlane(w, h) {
  const geometry = new THREE.PlaneGeometry(w, h);
  const material = new THREE.MeshBasicMaterial({
    color: 0x1f1f1f,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createBall(s) {
  const geometry = new THREE.SphereGeometry(s, 32, 16);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

const boardLength = 5;

const board = createBox(1, 1, boardLength);
board.position.x = 12;
scene.add(board);

const plane = createPlane(24, 20)
plane.rotation.x = Math.PI / 2
plane.position.y = -0.5
scene.add(plane)

const ball = createBall(0.5);
scene.add(ball);

let ballVelocityX = 0.2;
let ballVelocityY = 0.2;

const borderX = 10;
const borderY = 11;

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "f":
      currentCamera =
        currentCamera === normalCamera ? orbitCamera : normalCamera;
    case "ArrowLeft":
      board.position.z += 1;
      break;
    case "ArrowRight":
      board.position.z -= 1;
      break;
  }
});

window.addEventListener("mousemove", (e) => {
  const r = e.clientX % 255;
  const g = e.clientY % 255;
  const b = Math.floor(Math.random() * 255);
  ball.material.color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);

  board.position.z = -(e.clientX / window.innerWidth) * 30 + 15;
});

let score = 0;

function render() {
  requestAnimationFrame(render);

  ball.position.z += ballVelocityX;
  ball.position.x += ballVelocityY;

  // check collision with board
  const collide =
    ball.position.x > borderY &&
    ball.position.z >= board.position.z - boardLength / 2 &&
    ball.position.z <= board.position.z + boardLength / 2;

  if (collide) {
    score++;
    console.log("Score +: " + score);
  }

  if (ball.position.z > borderX || ball.position.z < -borderX) {
    ballVelocityX = -ballVelocityX;
  }

  if ((collide && ball.position.x > borderY) || ball.position.x < -borderY) {
    ballVelocityY = -ballVelocityY;
  }

  if (ball.position.x > borderY + 2) {
    ball.position.x = 0;
    score--;
    console.log("Score -: " + score);
  }

  control.target = board.position
  control.update()

  renderer.render(scene, currentCamera);
}

render();
