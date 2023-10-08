/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import * as THREE from "three";

const HEIGHT: number = window.innerHeight * 0.5;
const WIDTH: number = window.innerWidth * 0.5;

const ratio: number = WIDTH / HEIGHT;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
});
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

const color = 0xffffff;
const intensity = 2;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

function instantiateCube(
  geometry: THREE.BoxGeometry,
  color: number,
  x: number,
) {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = x;
  return cube;
}

function createSlider(
  name: string,
  set: (e: number) => void,
  defaultValue = 0,
) {
  const sliderTemplate = document.getElementById("slider");
  if (sliderTemplate == null) return;

  const sliderDiv = sliderTemplate.cloneNode(true) as HTMLDivElement;
  const input = sliderDiv.getElementsByTagName("input")[0];
  const p = sliderDiv.getElementsByTagName("p")[0];

  input.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement).value;
    set(parseInt(value));
    p.textContent = `${name}: ${value}`;
  });

  input.value = defaultValue.toString();
  p.textContent = `${name}: ${defaultValue}`;
  sliderDiv.style.display = "flex";
  sliderDiv.id = name;

  document.body.append(sliderDiv);
}

createSlider("X", (val) => (light.position.x = val), -1);
createSlider("Y", (val) => (light.position.y = val), 2);
createSlider("Z", (val) => (light.position.z = val), 4);

const geometry = new THREE.BoxGeometry(1, 1, 1);

const cubes = [
  instantiateCube(geometry, 0xff0000, -2),
  instantiateCube(geometry, 0x00ff00, 1),
  instantiateCube(geometry, 0x0000ff, 4),
];

const clock = new THREE.Clock();

const SPD = 0.5;
function animate() {
  const delta = clock.getDelta();
  cubes.forEach((cube, i) => {
    cube.rotation.x += SPD * delta * (i + 1);
    cube.rotation.y += SPD * delta * (i - 1);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
