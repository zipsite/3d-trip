export default class CoordControl {
    constructor(coords, container) {
        this.coords = coords;
        this.container = container;

        this.move = this.onPointerMove.bind(this);
        this.up = this.onPointerUp.bind(this);
        this.down = this.onPointerDown.bind(this);

        this.container.addEventListener('pointerdown', this.down);
    }

    onPointerDown(event) {
        console.log("down")

        // Указывает на то, что событие есть основное
        // Например, если есть сенсорный экран, и если был зажат один палец,
        // то эта переменная будет содержать true
        if (event.isPrimary === false) return;

        // Пользовательское взаимодействие происходит
        this.coords.isUserInteracting = true;

        // кординаты мыши с нажатым лкм записываются в параметры
        this.coords.onPointerDownMouseX = event.clientX;
        this.coords.onPointerDownMouseY = event.clientY;

        // Установка сферических координат на время нажатия лкм
        this.coords.onPointerDownLon = this.coords.lon;
        this.coords.onPointerDownLat = this.coords.lat;

        // Устанавливаем прослушиватели событий движений мыши и событие отпускания лкм
        this.container.addEventListener('pointermove', this.move);
        this.container.addEventListener('pointerup', this.up);
    }

    onPointerMove(event) {
        if (event.isPrimary === false) return;

        // вычисляем дельту между прошлыми и настоящими координатами мыши
        // и умножаем на 0.1, этот множитель можно воспринимать как скорость
        // И прибавляем временные сферические координаты и получаем основные сферические координаты
        this.coords.lon = this.coords.onPointerDownLon + (this.coords.onPointerDownMouseX - event.clientX) * 0.1;
        this.coords.lat = this.coords.onPointerDownLat + (event.clientY - this.coords.onPointerDownMouseY) * 0.1;
    }

    onPointerUp(event) {
        if (event.isPrimary === false) return;

        // Убираем пользовательское взаимодействие
        this.isUserInteracting = false;

        // Удаляем слушатели для перемещения мыши и отпускания лкм
        this.container.removeEventListener('pointermove', this.move);
        this.container.removeEventListener('pointerup', this.up);

    }
}