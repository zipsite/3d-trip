import * as THREE from 'three';

export default class Panorama {
    geometry;
    texture;
    material;
    mesh;

    constructor() {
        this.geometry = new THREE.SphereGeometry(500, 60, 40);

        // Делаем сферу, у которой поверхность изнутри
        this.geometry.scale(- 1, 1, 1);

        // Загружаем панораму и задаём её цветовое пространство, а так же делаем из неё материал
        this.texture = new THREE.TextureLoader().load('/public/access/textures/1.jpg');
        this.texture.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshBasicMaterial({ map: this.texture });

        // создаём 3d объект с наложенной текстурой и добавляем в сцену
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}