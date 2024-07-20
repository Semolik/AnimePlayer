<template>
    <div class="app-input-image">
        <img v-if="image" :src="image" />
        <div class="placeholder">
            <Icon :name="icon" v-if="!image" />
            <span class="message" v-else> Изменить </span>
        </div>
        <input type="file" accept="image/*" @change="onFileChange" />
    </div>
</template>
<script setup>
const props = defineProps({
    image: {
        type: String,
        default: null,
    },
    icon: {
        type: String,
        default: "material-symbols:image",
    },
});
const { image } = toRefs(props);
const emit = defineEmits(["change"]);
const { $toast } = useNuxtApp();
const onFileChange = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/") || file.type.indexOf("svg+xml") > -1) {
        $toast.error("Этот тип файла не поддерживается");
        return;
    }
    emit("change", file);
};
</script>
<style lang="scss" scoped>
.app-input-image {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 150px;
    width: 100%;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    background-color: transparent;
    border: 2px dashed $secondary-text;
    @include flex-center;
    transition: border-color 0.3s, background-color 0.3s;
    aspect-ratio: 1;

    &:hover {
        border-color: $accent;

        .placeholder {
            background-color: rgba(0, 0, 0, 0.5);

            svg {
                color: $accent;
            }

            .message {
                opacity: 1;
            }
        }
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .placeholder {
        inset: 0;
        position: absolute;
        @include flex-center;
        .message {
            opacity: 0;
            transition: opacity 0.3s;
        }
        svg {
            width: 40px;
            height: 40px;
            color: $secondary-text;
            transition: color 0.1s;
        }
    }

    input {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
}
</style>
