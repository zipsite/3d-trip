import * as THREE from 'three';
import Panorama from './Panorama';
import CoordControl from './CoordControl';

export default class ProcessRender {
    camera; scene; renderer;
    container; panorama;
    coordControl;

    // Взаимодействует пользователь или нет
    isUserInteracting;

    coords = {
        onPointerDownMouseX: 0, onPointerDownMouseY: 0,
        lon: 0, onPointerDownLon: 0,
        lat: 0, onPointerDownLat: 0,
    }

    phi = 0; theta = 0;

    constructor() {
        this.container = document.getElementById('container');

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

        this.scene = new THREE.Scene();
        
        this.panorama = new Panorama();
        this.scene.add(this.panorama.mesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.container.appendChild(this.renderer.domElement);
        this.container.style.touchAction = 'none';

        this.coordControl = new CoordControl(this.coords, this.container)

        // событие прокрутки колёсика мыши
        document.addEventListener('wheel', this.onDocumentMouseWheel.bind(this));
        // Событие изменения размера окна браузера
        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onDocumentMouseWheel(event) {

        // Множитель приближения
        let speed = 0.05

        // Вычисляем фокусное растояние
        const fov = this.camera.fov + event.deltaY * speed;

        // Устанавливаем фокусное растояние, но недаём ему выходить за рамки 10 - 75 mm
        this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

        // Обновляем камеру
        this.camera.updateProjectionMatrix();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();

    }

    update() {

        // Устанавливаем ограничения для широты
        this.coords.lat = Math.max(- 85, Math.min(85, this.coords.lat));

        // Трансформируем в положительное число и переводим в радианы
        this.coords.phi = THREE.MathUtils.degToRad(90 - this.coords.lat);

        // Просто переводим в радианы
        this.coords.theta = THREE.MathUtils.degToRad(this.coords.lon);

        // Переводим из сферических координат в декардовые
        let x = 500 * Math.sin(this.coords.phi) * Math.cos(this.coords.theta);
        let y = 500 * Math.cos(this.coords.phi);
        let z = 500 * Math.sin(this.coords.phi) * Math.sin(this.coords.theta);

        // Устанавливаем координаты, на которые нужно смотреть камере
        this.camera.lookAt(x, y, z);

        this.renderer.render(this.scene, this.camera);

    }
}