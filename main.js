import * as THREE from 'three';

let camera, scene, renderer;


// Взаимодействует пользователь или нет
let isUserInteracting = false;

// Координаты указателя мыши при нажатой лкм относительно контейнера с canvas
let onPointerDownMouseX = 0, onPointerDownMouseY = 0;

// Установка lon и let координат сферы
let lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0;

let phi = 0, theta = 0;

init();
animate();

function init() {
    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(500, 60, 40);

    // Делаем сферу, у которой поверхность изнутри
    geometry.scale(- 1, 1, 1);

    // Загружаем панораму и задаём её цветовое пространство, а так же делаем из неё материал
    const texture = new THREE.TextureLoader().load('/textures/1.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // создаём 3d объект с наложенной текстурой и добавляем в сцену
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Настраиваем рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    container.style.touchAction = 'none';

    // событие нажатия кнопки мыши
    container.addEventListener('pointerdown', onPointerDown);
    // событие прокрутки колёсика мыши
    document.addEventListener('wheel', onDocumentMouseWheel);
    // Событие изменения размера окна браузера
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown( event ) {

    // Указывает на то, что событие есть основное
    // Например, если есть сенсорный экран, и если был зажат один палец,
    // то эта переменная будет содержать true
    if ( event.isPrimary === false ) return;

    // Пользовательское взаимодействие происходит
    isUserInteracting = true;

    // кординаты мыши с нажатым лкм записываются в параметры
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    // Установка сферических координат на время нажатия лкм
    onPointerDownLon = lon;
    onPointerDownLat = lat;


    // Устанавливаем прослушиватели событий движений мыши и событие отпускания лкм
    document.addEventListener( 'pointermove', onPointerMove );
    document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    // вычисляем дельту между прошлыми и настоящими координатами мыши
    // и умножаем на 0.1, этот множитель можно воспринимать как скорость
    // И прибавляем временные сферические координаты и получаем основные сферические координаты
    lon = onPointerDownLon + ( onPointerDownMouseX - event.clientX ) * 0.1;
    lat = onPointerDownLat + ( event.clientY - onPointerDownMouseY ) * 0.1;
}

function onPointerUp(event) {

    if ( event.isPrimary === false ) return;

    // Убираем пользовательское взаимодействие
    isUserInteracting = false;

    // Удаляем слушатели для перемещения мыши и отпускания лкм
    document.removeEventListener( 'pointermove', onPointerMove );
    document.removeEventListener( 'pointerup', onPointerUp );

}

function onDocumentMouseWheel( event ) {

    // Множитель приближения
    let speed = 0.05

    // Вычисляем фокусное растояние
    const fov = camera.fov + event.deltaY * speed;

    // Устанавливаем фокусное растояние, но недаём ему выходить за рамки 10 - 75 mm
    camera.fov = THREE.MathUtils.clamp( fov, 10, 75 );

    // Обновляем камеру
    camera.updateProjectionMatrix();

}

function animate() {

    requestAnimationFrame( animate );
    update();

}

function update() {

    // Устанавливаем ограничения для широты
    lat = Math.max( - 85, Math.min( 85, lat ) );

    // Трансформируем в положительное число и переводим в радианы
    phi = THREE.MathUtils.degToRad( 90 - lat );

    // Просто переводим в радианы
    theta = THREE.MathUtils.degToRad( lon );

    // Переводим из сферических координат в декардовые
    const x = 500 * Math.sin( phi ) * Math.cos( theta );
    const y = 500 * Math.cos( phi );
    const z = 500 * Math.sin( phi ) * Math.sin( theta );

    // Устанавливаем координаты, на которые нужно смотреть камере
    camera.lookAt( x, y, z );

    renderer.render( scene, camera );

}