<template>
  <header>
    <div class="buttons left">
      <div :class="['button', { active: sidebar_opened }]" @click="toggleSidebar">
        <FontAwesomeIcon icon="fa-bars" class="closed-icon" />
        <FontAwesomeIcon icon="fa-bars-staggered" class="opened-icon" />
      </div>
    </div>
    <div :class="['sidebar', { active: sidebar_opened }]">
      <div class="item" @click="openSettingsOnMobile">
        <div class="text">Настройки</div>
        <FontAwesomeIcon icon="fa-gear" />
      </div>
    </div>
    <div v-bind:class="[{ active: open }, 'search-form']" v-on-click-outside="closeDropdown">
      <input type="text" @input="debounceSearch" :class="{ 'not-empty': textViewModel }" v-model="textViewModel"
        @focusin="openDropdown" placeholder="Введите название" />
      <div class="dropdown-container">
        <div class="dropdown-relative-container">
          <div v-bind:class="[loading ? 'loading' : '', 'search-dropdown']" v-show="txt && currentModule && open">
            <div class="tabs">
              <label :class="{ active: current == 'SearchAll' }">
                <input type="radio" v-model="current" value="SearchAll" />
                Все результаты
              </label>
              <label :class="{ active: current == 'CompB' }" v-if="currentModule">
                <input type="radio" v-model="current" value="CompB" />
                {{ currentModule.module_title }}
              </label>
            </div>
            <KeepAlive>
              <component :is="current" v-bind:text="this.text" @loading="setLoading" />
            </KeepAlive>
          </div>
          <LoadingAnimation v-if="this.loading" />
        </div>
      </div>
    </div>
    <div class="buttons right">
      <div class="button" @click="toggleSettings">
        <FontAwesomeIcon icon="fa-gear" />
      </div>
    </div>
  </header>
</template>


<script>
import SearchAll from "./SearchAll.vue";
import CompB from "./CompB.vue";
import { vOnClickOutside } from "@vueuse/components";
import { HTTP } from "../http-common.vue";
import LoadingAnimation from "./LoadingAnimation.vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faBarsStaggered, faGear } from '@fortawesome/free-solid-svg-icons';
library.add([faBars, faBarsStaggered, faGear]);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useMainStore } from '../stores/main';

export default {
  setup() {
    const store = useMainStore();
    const { toggleSettings, openSettings } = store;
    return {
      toggleSettings,
      openSettings
    }
  },
  components: {
    CompB,
    SearchAll,
    LoadingAnimation,
    FontAwesomeIcon,
  },
  directives: {
    OnClickOutside: vOnClickOutside,
  },
  data() {
    return {
      open: false,
      current: "SearchAll",
      currentModule: null,
      text: "",
      textViewModel: "",
      txt: "",
      moduleId: null,
      loading: false,
      settings_opened: false,
      sidebar_opened: false,
    };
  },
  watch: {
    text(newText) {
      if (!this.touched) this.internalValue = newText;
    },
    "$route.params.module"(value) {
      this.moduleId = value;
    },
    moduleId(value) {
      this.getModuleData(value);
    },
    sidebar_opened(value) {
      document.body.style.overflow = value === true ? 'hidden' : null;
    }
  },
  mounted() {
    this.getModuleData(this.$router.currentRoute.value.params.module);
  },

  methods: {
    closeDropdown() {
      this.open = false;
    },
    openDropdown() {
      this.open = true;
    },
    openSettingsOnMobile() {
      this.closeSidebar();
      this.openSettings({ mobile: true });
    },
    closeSidebar() {
      this.sidebar_opened = false;
    },
    toggleSidebar() {
      this.sidebar_opened = !this.sidebar_opened;
    },
    getModuleData(module_id) {
      if (!module_id) {
        this.currentModule = null;
        return;
      }
      HTTP.get("/utilities/moduleinfo", {
        params: { module_id: module_id },
      })
        .then((response) => {
          this.currentModule = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.currentModule = null;
        });
    },
    setLoading(val) {
      this.loading = val;
    },
    debounceSearch(event) {
      var text = event.target.value;
      this.txt = text;
      if (!text) {
        this.text = null;
      }
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        const text = event.target.value;
        this.data = null;
        if (!text) {
          return;
        }
        this.text = text;
      }, 400);
    },
  },

};
</script>
<style scoped lang="scss">
@use "@/assets/styles/breakpoints";
@use "@/assets/styles/shadows";

header {
  --border-radius: 10px;
  --padding: 10px;
  --transition: 0.4s;
  display: grid;
  grid-template-columns: 1fr min(650px, 100%) 1fr;
  background-color: var(--color-background-soft);
  padding: var(--padding);
  color: var(--color-text-rev);
  position: relative;

  @include breakpoints.lg(true) {
    grid-template-columns: 60px 1fr;
  }

  .sidebar {
    position: absolute;
    background: var(--color-background-soft);
    z-index: 10;
    top: 100%;
    left: -100%;
    height: calc(100vh - 100%);
    transition: .2s left;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;

    &.active {
      left: 0;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      color: var(--color-text);
      background: var(--color-background-mute-2);

      .text {
        font-size: 1.2em;
      }
    }
  }


  .buttons {
    display: flex;
    gap: 10px;

    .button {
      background-color: var(--color-background-mute-3);
      height: 100%;
      aspect-ratio: 1;
      display: grid;
      place-content: center;
      border-radius: var(--border-radius);
      transition: .2s transform;
      color: var(--color-text);
      cursor: pointer;

      svg {
        width: 25px;
        height: 25px;
        color: black;
      }

      &:active {
        transform: scale(1.05);
      }
    }

    &.right {
      justify-content: right;

      @include breakpoints.lg(true) {
        display: none;
      }
    }

    &.left {
      @include breakpoints.lg {
        display: none;
      }

      .button {

        .closed-icon {
          display: block;
        }

        .opened-icon {
          display: none;
        }

        &.active {
          .closed-icon {
            display: none;
          }

          .opened-icon {
            display: block;
          }
        }
      }
    }
  }


  .search-form {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    grid-column: 2;
    // margin-inline: auto;

    input {
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      padding: 10px;
      font-size: 1.3em;
      font-weight: 400;
      line-height: normal;
      border-radius: var(--border-radius);
      background-color: var(--color-background-mute-2);
      color: var(--color-text);
      transition: color 0.2s;

      &:active,
      &:focus {
        outline: none;
      }
    }

    &.active {
      input.not-empty {
        background-color: var(--color-text);
        color: var(--color-text-rev);
      }
    }

    .dropdown-container {
      position: absolute;
      top: calc(100% + 5px);
      width: 100%;
      display: flex;
      overflow: hidden;
      border-radius: var(--border-radius);
      z-index: 99;

      .dropdown-relative-container {
        position: relative;
        display: flex;
        width: 100%;

        .search-dropdown {
          background-color: var(--color-background-mute);
          width: 100%;
          padding: var(--padding);
          z-index: 2;

          &.loading {
            filter: blur(10px);
          }

          .results {
            display: flex;
            flex-direction: column;
            position: relative;
          }

          .tabs {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
            background-color: var(--color-background-mute-2);
            border-radius: 0.5rem;

            @include breakpoints.sm {
              grid-template-columns: repeat(2, 1fr);
            }

            label {
              padding: 5px;
              position: relative;
              text-align: center;
              user-select: none;
              transition: background-color var(--transition), color var(--transition);
              font-size: 1.3em;
              border-radius: 0.5rem;

              &.active {
                color: var(--color-text);
                background-color: var(--color-background-soft);
              }

              input {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
