<template>
    <div class="buttons-panel">
        <p class="button" @click="back()">
            Назад
        </p>
        <p class="button" @click="next()">
            Вперёд
        </p>
    </div>
</template>

<script>
export default {
    name: "App",
    methods: {
        next() {
            this.$pano.next()
        },
        back() {
            this.$pano.back()
        }
    }
}
</script>