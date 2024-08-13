<template>
    <FormKit
        :label="label"
        v-model="modelValue"
        :placeholder="placeholder"
        :type="type"
        :disabled="disabled"
        :classes="{
            input: wrong ? 'wrong' : '',
        }"
        v-bind="$attrs"
    />
</template>
<script setup>
const props = defineProps({
    label: {
        type: String,
    },
    modelValue: {
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
const { label, placeholder, type } = props;
const emit = defineEmits(["update:modelValue", "update:wrong"]);
const modelValue = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit("update:modelValue", val);
        if (type === "email" && !/^[^@]+@\w+(\.\w+)+\w$/.test(val)) {
            emit("update:wrong", true);
        } else {
            emit("update:wrong", false);
        }
    },
});
</script>
<style lang="scss">
.formkit-outer {
    color: $primary-text;
    width: 100%;

    .formkit-messages {
        padding-top: 3px;
        .formkit-message {
            color: $secondary-text;
            font-size: 14px;
        }
    }

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
                border: 1px solid #363636;
                min-height: 45px;
                padding: 6px 12px;
                transition: border-color 0.15s ease-in-out,
                    box-shadow 0.15s ease-in-out;
                width: 100%;
                color: $primary-text;
                font-size: 16px;
                &.wrong {
                    border-color: $accent-error;
                    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%),
                        0 0 8px $accent-error;
                    outline: 0;
                }
                &:not(.wrong):focus {
                    border-color: $accent;
                    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px $accent;
                    outline: 0;
                }
            }
        }
    }
}
</style>
