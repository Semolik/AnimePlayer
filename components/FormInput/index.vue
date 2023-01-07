<template>
    <FormKit
        :label="label"
        :value="value"
        :placeholder="placeholder"
        :type="type"
        :classes="{
            input: error ? 'error' : '',
        }"
    />
</template>
<script setup>
const { label, value, placeholder, type } = defineProps({
    label: {
        type: String,
    },
    value: {
        type: String,
    },
    placeholder: {
        type: String,
    },
    type: {
        type: String,
        default: "text",
    },
    error: {
        type: Boolean,
    },
});
const modelValue = ref(value);
watch(modelValue, (val) => {
    $emit("update:modelValue", val);
});
</script>
<style lang="scss">
.formkit-outer {
    color: $primary-text;

    .formkit-wrapper {
        display: flex;
        flex-direction: column;
        gap: 7px;
        .formkit-label {
            font-size: 14px;
            padding-left: 3px;
            color: $secondary-text;
        }
        .formkit-inner {
            .formkit-input {
                border-radius: 5px;
                background-color: #181818;
                border: 1px solid #363636;
                height: 40px;
                padding: 6px 12px;
                transition: border-color 0.15s ease-in-out,
                    box-shadow 0.15s ease-in-out;
                width: 100%;
                color: $primary-text;
                font-size: 14px;
                &.error {
                    border-color: $accent-error;
                    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%),
                        0 0 8px $accent-error;
                    outline: 0;
                }
                &:not(.error):focus {
                    border-color: #66afe9;
                    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%),
                        0 0 8px rgb(102 175 233 / 60%);
                    outline: 0;
                }
            }
        }
    }
}
</style>
