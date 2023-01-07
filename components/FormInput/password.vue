<template>
    <div class="input-password">
        <FormInput
            v-model="password"
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
        />
        <div class="password-strength">
            <div
                v-for="i in 4"
                :key="i"
                :class="{
                    'password-strength__item': true,
                    'password-strength__item--active':
                        strength.id >= i - 1 && password.length !== 0,
                }"
            ></div>
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
const emit = defineEmits(["update:modelValue"]);
const { modelValue } = defineProps({
    modelValue: {
        type: String,
        default: "",
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

        .password-strength__item {
            width: 25%;
            height: 5px;
            background-color: $primary-bg;
        }
        @mixin strength-progress($color, $count) {
            &:has(.password-strength__item--active:nth-child(#{$count})) {
                .password-strength__item--active {
                    background-color: $color;
                }
            }
        }
        @include strength-progress($accent-error, 1);
        @include strength-progress($accent-warning, 2);
        @include strength-progress($accent-success, 3);
        @include strength-progress($accent-success, 4);
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
