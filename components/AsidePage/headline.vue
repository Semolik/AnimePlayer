<template>
    <div class="headline">
        <div class="headline__title">
            <h1>{{ title }}</h1>
        </div>
    </div>
</template>
<script setup>
const { title, subtitle } = defineProps({
    title: {
        type: String,
        default: null,
    },
    subtitle: {
        type: String,
        default: null,
    },
});
</script>
<style lang="scss">
.headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
    .headline__title {
        h1 {
            font-size: 24px;
            font-weight: 500;
            color: $secondary-text;
            text-align: center;
        }
        .headline__title__subtitle {
            span {
                font-size: 14px;
                color: $secondary-text;
            }
        }
    }
    .headline__actions {
        display: flex;
        gap: 10px;
    }
}
</style>
