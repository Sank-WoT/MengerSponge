import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Particles
 */
let particlesGeometry = new THREE.BufferGeometry()

const countPoints = 100000
const points = [[0, 0, 0], [0, 2, 0], [0, 0, 2], [2, 0, 0], [2, 2, 0], [2, 2, 2], [0, 2, 2], [2, 0, 2], [0, 1, 0], [1, 0, 0], [1, 2, 0], [2, 2, 1], [2, 1, 0], [2, 0, 1], [2, 1, 2], [1, 2, 2], [1, 0, 2], [0, 1, 2], [0, 2, 1], [0, 1, 1]]
const startPoint = [Math.random() * 2, Math.random() * 2, Math.random() * 2]
const scale = 2
let attract = Math.round(Math.random() * 19) 
let nextPoint = [(startPoint[0] + 2 * points[attract][0]) / 3, (startPoint[1] + 2 * points[attract][1]) / 3, (startPoint[2] + 2 * points[attract][2]) / 3]
console.log(nextPoint)
const position = new Float32Array(countPoints * 3)
for(let i = 0; i < 20; i++) {
    for(let j = 0; j < 3; j++) {
        position[i * 3 + j] = points[i][j] * scale 
    }
}

position[21 * 3] = startPoint[0] * scale
position[21 * 3 + 1] = startPoint[1] * scale
position[21 * 3 + 2] = startPoint[2] * scale

position[22 * 3] = nextPoint[0] * scale
position[22 * 3 + 1] = nextPoint[1] * scale
position[22 * 3 + 2] = nextPoint[2] * scale
let timer = 1
let nubmerPoint = 23

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(position, 3)
)

const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.01
particlesMaterial.sizeAttenuation = true
particlesMaterial.color = new THREE.Color( '#ff0000' );

let particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let particlesForFrame = 0
const tick = () =>
{
    stats.begin();
    const elapsedTime = clock.getElapsedTime()

    if(elapsedTime - timer > 0.1 && nubmerPoint < countPoints) {
        for(particlesForFrame; particlesForFrame < 1000; particlesForFrame++) {
            attract = Math.round(Math.random() * 19) 
            nextPoint = [(nextPoint[0] + 2 * points[attract][0]) / 3, (nextPoint[1] + 2 * points[attract][1]) / 3, (nextPoint[2] + 2 * points[attract][2]) / 3]
            position[nubmerPoint * 3] = nextPoint[0] * scale
            position[nubmerPoint * 3 + 1] = nextPoint[1] * scale
            position[nubmerPoint * 3 + 2] = nextPoint[2] * scale
            nubmerPoint++       
        }

        particlesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(position, 3)
        )
        particles = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.remove(particles)
        scene.add(particles)
        timer = elapsedTime
        particlesForFrame = 0
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end();
}

tick()