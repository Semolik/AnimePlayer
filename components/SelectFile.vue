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
            <div class="text">Выбрать файл</div>
        </div>
        <label for="file"></label>
    </div>
</template>
<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();
const file = ref(null);
const isDragging = ref(false);
const supportedExtensions = ["jpg", "jpeg", "png"];
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

const onChange = () => {
    var files = file.value.files;
    if (
        !supportedExtensions.includes(
            files[0].name.split(".").pop().toLowerCase()
        )
    ) {
        toast.error("Неподдерживаемый формат файла");
        file.value.files = new DataTransfer().files;
        return;
    }
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
        --color: #{$secondary-text};
        input {
            display: none;
        }
        svg {
            width: 50px;
            height: 50px;
            margin-bottom: 10px;
            color: var(--color);
        }
        .text {
            cursor: pointer;
            font-size: 14px;
            width: 100%;
            text-align: center;
            color: var(--color);
        }

        &:hover {
            --color: #{$accent};
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
