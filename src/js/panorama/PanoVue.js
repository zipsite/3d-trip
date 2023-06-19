export default {
    install: (app, option) => {
        app.config.globalProperties.$pano = {
            next() {
                option.next()
            },
            back() {
                option.back()
            }
        }
    }
}