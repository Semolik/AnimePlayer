<template>
    <div :class="['settings', { close: runCloseAnimation }, { mobile: OpenSettingsConfig.mobile }]"
        @click.self="CloseWithAnimation" v-if="SettingsOpened" :style="{ '--timeout': timeoutVar }">
        <div class="window">
            <div class="head">
                <div class="label">Настройки</div>
                <FontAwesomeIcon icon="fa-xmark" class="close" @click="CloseWithAnimation" />
            </div>
            <div class="sections-selector">
                <div :class="['section-name', { active: section.component == currentComponent }]"
                    v-for="section in sections" @click="currentComponent = section.component">{{
                            section.name
                    }}</div>
            </div>
            <div class="sections">
                <section>
                    <component v-bind:is="currentComponent"></component>
                </section>
            </div>
        </div>
    </div>
</template>
<script>
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
library.add(faXmark);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import AppSettingsAppearance from './AppSettingsAppearance.vue';

export default {
    setup() {
        const store = useMainStore();
        const { SettingsOpened, OpenSettingsConfig } = storeToRefs(store);
        const { closeSettings } = store;
        return {
            SettingsOpened,
            OpenSettingsConfig,
            closeSettings
        }
    },
    components: {
        FontAwesomeIcon,
        AppSettingsAppearance,
    },
    data() {
        return {
            sections: [{
                name: "Внешний вид",
                component: 'AppSettingsAppearance',
            }],
            currentComponent: '',
            runCloseAnimation: false,
            timeout: 400,
        }
    },
    methods: {
        CloseWithAnimation() {
            this.runCloseAnimation = true;
            setTimeout(() => {
                this.closeSettings();
                this.runCloseAnimation = false;
            }, this.timeout)
        }
    },
    computed: {
        timeoutVar() {
            return this.timeout / 1000 + 's';
        }
    }
}
</script>
<style lang="scss">
@use "@/assets/styles/breakpoints";
$dropdown-transition: .4s;
$padding: 10px;

.settings {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    justify-content: right;
    overflow: hidden;
    display: flex;
    height: 100vh;
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.6);
    backdrop-filter: blur(10px) opacity(1);

    @include breakpoints.lg {
        padding: 10px;
    }

    @mixin openStart {
        background-color: transparent;
        backdrop-filter: blur(10px) opacity(0);
    }

    @mixin openEnd {
        background-color: rgba($color: #000000, $alpha: 0.6);
        backdrop-filter: blur(10px) opacity(1);
    }

    @keyframes opensettings {
        from {
            @include openStart
        }

        to {
            @include openEnd
        }
    }

    @keyframes closesettings {
        from {
            @include openEnd
        }

        to {
            @include openStart
        }
    }

    animation: var(--timeout) opensettings;

    @mixin openWindowStart {
        right: -100%;
    }

    @mixin openWindowEnd {
        right: 0;
    }

    &.close {
        animation: var(--timeout) closesettings;

        .window {
            @keyframes closeWindowAnimation {

                from {
                    @include openWindowEnd
                }

                to {

                    @include openWindowStart
                }
            }

            animation: var(--timeout) closeWindowAnimation;
        }
    }


    .window {
        animation: var(--timeout) openWindowAnimation;

        @keyframes openWindowAnimation {
            from {
                @include openWindowStart
            }

            to {
                @include openWindowEnd
            }
        }

        position: absolute;
        background: var(--color-background-soft);
        max-width: 1200px;
        

        @include breakpoints.lg(true) {
            width: 100vw;
            height: 100vh;
            grid-template-rows: min-content min-content 1fr;
            right: 0;
        }

        @include breakpoints.lg {
            height: calc(100vh - $padding * 2);
            width: calc(100vw - $padding * 2);
            right: $padding;
            border-radius: 20px;
            grid-template-columns: 250px 1fr;
            grid-template-rows: min-content 1fr;
        }

        padding: 20px;
        display: grid;
        row-gap: 10px;
        column-gap: 30px;
        flex-direction: column;

        .head {
            display: flex;
            grid-column: 1 / -1;
            width: 100%;
            margin-bottom: 10px;

            .label {
                flex-grow: 1;
                font-size: 1.5em;
            }

            .close {
                background-color: var(--color-background-mute-2);
                height: 20px;
                border-radius: 50%;
                width: 20px;
                padding: 5px;
                cursor: pointer;
                transition: .2s scale, .2s background-color;

                &:hover {
                    background-color: var(--color-background-mute-3);
                }

                &:active {
                    transform: scale(1.05);
                }
            }
        }

        .sections-selector {
            .section-name {
                padding: 10px;
                border-radius: 10px;
                // background-color: var(--color-background-mute);

                &.active {
                    background-color: var(--color-background-mute-2);
                }

                &:not(.active):hover {
                    background-color: var(--color-background-mute);
                }
            }
        }

        .sections {
            display: flex;
            flex-direction: column;

            section {
                display: flex;

                .block {
                    width: 100%;
                    padding-bottom: 10px;

                    .headline {
                        font-size: 1.2em;
                        margin-bottom: 10px;
                    }

                    border-bottom: 1px solid var(--color-background-mute-2);
                }

                .block:last-child {
                    border-bottom: none;
                }
            }
        }


    }
}
</style>