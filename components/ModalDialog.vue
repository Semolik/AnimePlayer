<template>
    <ClientOnly>
        <Teleport to="body" v-if="active">
            <Transition name="modal">
                <div
                    :class="[
                        'modal-bg',
                        { open: isActive },
                        { close: isClosing },
                    ]"
                    v-if="isActive"
                    @click.self="
                        props.closeButton || props.offOutsideClickClose
                            ? null
                            : closeModal()
                    "
                >
                    <div class="modal">
                        <div
                            class="headline"
                            v-if="headline || props.closeButton"
                        >
                            <h3 class="text">{{ headline }}</h3>
                            <div
                                class="close-button"
                                v-if="props.closeButton"
                                @click="closeModal"
                            >
                                <Icon name="material-symbols:close" />
                            </div>
                        </div>
                        <div class="description" v-if="description">
                            {{ description }}
                        </div>
                        <div class="modal-content">
                            <slot></slot>
                        </div>
                        <div class="modal-buttons">
                            <slot
                                name="buttons"
                                :closeModal="closeModal"
                            ></slot>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </ClientOnly>
</template>
<script setup>
const props = defineProps({
    active: Boolean,
    headline: String,
    yesButton: Boolean,
    yesLoading: Boolean,
    noButton: Boolean,
    description: String,
    maxWidth: {
        type: Number,
        default: 400,
    },
    transition: {
        type: Number,
        default: 250,
    },
    maxWidth: {
        type: Number,
        default: 500,
    },
    maxHeight: {
        type: Number,
        default: 800,
    },
    padding: {
        type: Number,
        default: 10,
    },
    offOutsideClickClose: {
        type: Boolean,
        default: false,
    },
    closeButton: {
        type: Boolean,
        default: false,
    },
    gap: {
        type: Number,
        default: 10,
    },
});
const description = ref(props.description);
const emit = defineEmits(["update:active"]);
const transitionString = computed(() => {
    return `${props.transition}ms`;
});
const width = computed(() => {
    return `${props.maxWidth}px`;
});
const height = computed(() => {
    return `${props.maxHeight}px`;
});
const paddingString = computed(() => {
    return `${props.padding}px`;
});
const gapString = computed(() => {
    return `${props.gap}px`;
});
const isClosing = ref(false);
const isActive = ref(true);
const closeModal = () => {
    isClosing.value = true;
    setTimeout(() => {
        emit("update:active", false);
        isActive.value = false;
        isClosing.value = false;
    }, props.transition);
};
const openModal = () => {
    isActive.value = true;
};
watch(
    () => props.active,
    (value) => {
        if (value) {
            openModal();
        } else {
            closeModal();
        }
    }
);
</script>
<style lang="scss">
.modal-enter-active,
.modal-leave-active {
    transition: all v-bind(transitionString) ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-bg {
    position: fixed;
    inset: 0;
    background-color: rgba($color: #000000, $alpha: 0.5);
    @include flex-center;
    z-index: 99;
    opacity: 0;
    transition: opacity v-bind(transitionString) ease-in-out;
    &.open {
        animation: open v-bind(transitionString) ease-in-out;
        opacity: 1;
    }
    &.close {
        animation: close v-bind(transitionString) ease-in-out;
        opacity: 0;
    }
    @keyframes open {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes close {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .modal {
        background-color: $secondary-bg;
        max-width: v-bind(width);
        max-height: v-bind(height);
        width: 100%;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        padding: v-bind(paddingString);
        gap: v-bind(gapString);
        .headline {
            @include flex-center;

            padding-bottom: 0;

            .text {
                flex-grow: 1;
                line-height: 1.5rem;
                font-size: 1.2rem;
                color: $secondary-text;
                text-align: center;
            }

            .close-button {
                border-radius: 50%;
                padding: 5px;
                background-color: $quaternary-bg;
                width: 30px;
                height: 30px;
                @include flex-center;
                cursor: pointer;

                svg {
                    width: 18px;
                    height: 18px;
                    color: $secondary-text;
                }
                &:hover {
                    background-color: $quinary-bg;
                }
            }
        }
        .description {
            font-size: 0.875rem;
            color: $secondary-text;
        }

        .modal-content {
        }

        .modal-buttons {
            display: flex;
            gap: 5px;
        }
    }
}
</style>
