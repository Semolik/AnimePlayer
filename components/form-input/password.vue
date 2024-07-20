<template>
    <div class="input-password">
        <FormInput
            v-model="password"
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
        />
        <div class="password-strength">
            <div class="bar">
                <div
                    :class="['progress', `id-${strength.id}`]"
                    :style="{
                        width: `${
                            strength.length > 0 ? (strength.id + 1) * 25 : 0
                        }%`,
                    }"
                ></div>
            </div>
        </div>
        <div class="password-contain">
            <div
                :class="[
                    'password-contain-item',
                    {
                        active: containLowerAndUpper,
                    },
                ]"
            >
                <Icon name="material-symbols:check-circle" />
                <div class="password-contain-item__text">
                    <span> Содержит верхний и нижний регистр </span>
                </div>
            </div>
            <div
                :class="[
                    'password-contain-item',
                    {
                        active: containNumber,
                    },
                ]"
            >
                <Icon name="material-symbols:check-circle" />
                <div class="password-contain-item__text">
                    <span> Содержит цифры </span>
                </div>
            </div>
            <div
                :class="[
                    'password-contain-item',
                    {
                        active: containsSymbols,
                    },
                ]"
            >
                <Icon name="material-symbols:check-circle" />
                <div class="password-contain-item__text">
                    <span> Содержит специальные символы </span>
                </div>
            </div>
            <div
                :class="[
                    'password-contain-item',
                    {
                        active: containsMoreThan10,
                    },
                ]"
            >
                <Icon name="material-symbols:check-circle" />
                <div class="password-contain-item__text">
                    <span> Содержит 10 и более символов </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { passwordStrength } from "check-password-strength";
const emit = defineEmits(["update:modelValue", "update:wrong"]);
const { modelValue } = defineProps({
    modelValue: {
        type: String,
        default: "",
        required: true,
    },
});
const password = ref(modelValue);
watch(password, (value) => {
    emit("update:modelValue", value);
});
const strength = computed(() => passwordStrength(password.value));
const containLowerAndUpper = computed(() => {
    return ["lowercase", "uppercase"].every((rule) =>
        strength.value.contains?.includes(rule)
    );
});
const containNumber = computed(() => {
    return strength.value.contains?.includes("number");
});
const containsSymbols = computed(() => {
    return strength.value.contains?.includes("symbol");
});
const containsMoreThan10 = computed(() => {
    return strength.value?.length >= 10;
});
watch(strength, (value) => {
    if (!value) return;
    if (value.id < 1) {
        emit("update:wrong", true);
    } else {
        emit("update:wrong", false);
    }
});
</script>
<style lang="scss">
.input-password {
    display: flex;
    flex-direction: column;
    gap: 7px;
    .password-strength {
        display: flex;
        justify-content: space-between;
        border-radius: 10px;
        margin: 0 2px;
        overflow: hidden;

        .bar {
            width: 100%;
            height: 5px;
            background-color: $primary-bg;
            .progress {
                height: 100%;
                background-color: $accent-success;
                transition: width 0.3s ease;
                &.id-0 {
                    background-color: $accent-error;
                }
                &.id-1 {
                    background-color: $accent-warning;
                }
                &.id-2 {
                    background-color: $accent-success;
                }
            }
        }
    }
    .password-contain {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 10px;
        .password-contain-item {
            display: flex;
            align-items: center;
            gap: 10px;
            &.active svg {
                color: $accent-success;
            }
            svg {
                width: 15px;
                height: 15px;
                color: $secondary-text;
            }
            &__text {
                span {
                    font-size: 15px;
                    color: $secondary-text;
                }
            }
        }
    }
}
</style>
