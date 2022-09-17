import { defineStore } from 'pinia'

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    OpenSettingsConfig: {},
    SettingsOpened: false
  }),
  actions: {
    openSettings(config = {}) {
      this.OpenSettingsConfig = config;
      this.SettingsOpened = true;
    },
    closeSettings() {
      this.OpenSettingsConfig = {};
      this.SettingsOpened = false;
    },
    toggleSettings(config = {}) {
      if (this.SettingsOpened) {
        this.closeSettings();
      } else {
        this.openSettings(config);
      }
    }
  }
})