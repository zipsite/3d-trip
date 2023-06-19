export default class PanoControll {
    constructor(panorama) {
        this.panorama = panorama;
        this.counter = 0;
        this.texturesList = [];
        this.loadTextureList();
    }

    loadTextureList() {
        fetch('/public/access/textures/textures.json').then(res => {
            res.json().then(res => {
                this.texturesList = res;
                this.panorama.loadTexture(this.texturesList[this.counter])

            })
        });
    }

    goTo(drct) {
        let tmpCounter = Math.max(0, Math.min(this.counter + drct, this.texturesList.length - 1))
        if (tmpCounter != this.counter) {
            this.counter = tmpCounter;
            this.panorama.loadTexture(this.texturesList[this.counter])

        }
    }

    next() {
        this.goTo(1)
    }

    back() {
        this.goTo(-1)
    }
}