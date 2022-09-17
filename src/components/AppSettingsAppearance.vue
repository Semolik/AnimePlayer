<template>
    <div class="block">
        <div class="headline">Тема</div>
        <div class="theme-selector">
            <template v-for="item in themes">
                <AppSettingsAppearanceThemeItem v-bind:setTheme="setTheme" v-bind:themeData="item"
                    v-bind:active="theme == item.value" v-if="item.value !== 'auto'" />
                <div class="auto-theme" @click="setTheme('auto')" v-else>
                    <AppSettingsAppearanceThemeItem v-bind:themeData="{ name: item.name, value: th }"
                        v-bind:active="theme == item.value" v-for="th in ['light', 'dark']" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { useThemeStore } from '../stores/theme';
import { storeToRefs } from 'pinia';
import AppSettingsAppearanceThemeItem from './AppSettingsAppearanceThemeItem.vue';

export default {
    setup() {
        const themeStore = useThemeStore();
        const { theme } = storeToRefs(themeStore);
        const { setTheme } = themeStore;
        return {
            theme,
            setTheme
        }
    },
    components: {
        AppSettingsAppearanceThemeItem,

    },
    data() {
        return {
            themes: [
                {
                    icon: 'fa-sun',
                    value: 'light',
                    name: 'Светлая',
                },
                {
                    icon: 'fa-moon',
                    value: 'dark',
                    name: 'Темная',
                },
                {
                    icon: 'fa-laptop',
                    value: 'auto',
                    name: 'Авто',
                },
            ],
        }
    }
}

</script>

<style scoped lang="scss">
.block .theme-selector {
    display: flex;
    gap: 10px;

    .auto-theme {
        position: relative;

        .light {
            clip-path: polygon(0 0, 100% 100%, 0 100%);
            z-index: 2;
        }

        .dark {
            z-index: 1;
        }
    }

}
</style>