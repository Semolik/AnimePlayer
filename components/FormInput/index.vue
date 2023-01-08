<template>
    <FormKit
        :label="label"
        :value="value"
        v-model="modelValue"
        :placeholder="placeholder"
        :type="type"
        :disabled="disabled"
        :classes="{
            input: wrong ? 'wrong' : '',
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
    wrong: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:modelValue", "update:wrong"]);
const modelValue = ref(value);
watch(modelValue, (val) => {
    emit("update:modelValue", val);
    if (type === "email" && !/^[^@]+@\w+(\.\w+)+\w$/.test(val)) {
        emit("update:wrong", true);
    } else {
        emit("update:wrong", false);
    }
});
</script>
<style lang="scss">
.formkit-outer {
    color: $primary-text;
    width: 100%;

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
                &.wrong {
                    border-color: $accent-error;
                    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%),
                        0 0 8px $accent-error;
                    outline: 0;
                }
                &:not(.wrong):focus {
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
