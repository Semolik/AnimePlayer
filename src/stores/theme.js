import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useThemeStore = defineStore({
    id: 'theme',
    state: () => ({
        theme: useStorage('theme', 'auto'),
        themeName: '',
    }),
    actions: {
        initTheme() {
            this.setTheme(this.theme);
            this.StartTrackingThemeChange();
        },
        setTheme(name) {
            console.log(name);
            this.theme = name;
            if (name === 'auto') {
                this.setThemeName(this.isDark().matches ? 'dark' : 'light');
            } else {
                this.setThemeName(name);
            }
        },
        setThemeName(name) {
            this.themeName = name;
            document.firstElementChild.setAttribute('data-theme', name);
        },
        isDark() {
            return window.matchMedia('(prefers-color-scheme: dark)');
        },
        StartTrackingThemeChange() {
            this.isDark()
                .addEventListener('change', ({ matches: isDark }) => {
                    console.log(isDark);
                    if (this.theme === 'auto') {
                        this.setThemeName(isDark ? 'dark' : 'light');
                    }
                })
        }
    }
});
