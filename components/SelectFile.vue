<template>
    <div
        class="select-file"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
    >
        <div
            :class="['select-file-container', { dragging: isDragging }]"
            @change="onChange"
        >
            <input
                type="file"
                id="file"
                ref="file"
                :accept="supportedExtensionsString"
            />
            <Icon name="material-symbols:upload-sharp" />
            <div class="text">
                Перетащите {{ isPicture ? "изображение" : "файл" }} сюда или
                нажмите, чтобы выбрать
            </div>
            <div class="max-size">
                Максимальный размер файла: {{ maxSize }} МБ
            </div>
        </div>
        <label for="file"></label>
    </div>
</template>
<script setup>
import { useToast } from "vue-toastification";
const { supportedExtensions, isPicture, maxSize, modelValue } = defineProps({
    supportedExtensions: {
        type: Array,
        default: ["jpg", "jpeg", "png"],
    },
    isPicture: {
        type: Boolean,
        default: false,
    },
    maxSize: {
        type: Number,
        default: 50,
    },
    modelValue: {
        type: File,
        default: null,
    },
});
const toast = useToast();
const file = ref(null);
const isDragging = ref(false);
const emit = defineEmits(["update:modelValue"]);

const supportedExtensionsString = supportedExtensions
    .map((e) => "." + e)
    .join(", ");

const dragover = (e) => {
    e.preventDefault();
    isDragging.value = true;
};
const dragleave = (e) => {
    isDragging.value = false;
};
const drop = (e) => {
    e.preventDefault();
    file.value.files = e.dataTransfer.files;
    onChange();
    isDragging.value = false;
};
const resetInput = () => {
    file.value.files = new DataTransfer().files;
    emit("update:modelValue", null);
};
const onChange = () => {
    var files = file.value.files;
    if (
        !supportedExtensions.includes(
            files[0].name.split(".").pop().toLowerCase()
        )
    ) {
        toast.error("Неподдерживаемый формат файла");
        resetInput();
        return;
    }
    if (files[0].size > maxSize * 1024 * 1024) {
        toast.error("Файл слишком большой");
        resetInput();
        return;
    }
    emit("update:modelValue", files[0]);
};
</script>
<style lang="scss">
.select-file {
    border: 2px dashed $secondary-text;
    border-radius: 10px;
    padding: 20px;
    min-height: 300px;
    display: flex;
    position: relative;

    .select-file-container {
        &.dragging::after {
            content: "";
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
        }
        @include flex-center;
        flex-direction: column;
        width: 100%;

        input {
            display: none;
        }
        svg {
            width: 50px;
            height: 50px;
            margin-bottom: 10px;
            color: $secondary-text;
        }
        .text {
            cursor: pointer;
            font-size: 14px;
            width: 100%;
            text-align: center;
            color: $secondary-text;
        }
        .max-size {
            font-size: 12px;
            color: $tertiary-text;
            margin-top: 10px;
        }
    }
    label {
        position: absolute;
        inset: 0;
        cursor: pointer;
        opacity: 0;
    }
}
</style>
