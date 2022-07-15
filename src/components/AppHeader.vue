<script>
import SearchAll from "./SearchAll.vue";
import CompB from "./CompB.vue";
import { vOnClickOutside } from "@vueuse/components";
import { HTTP } from "../http-common.vue";
import LoadingAnimation from "./LoadingAnimation.vue";
export default {
  data() {
    return {
      open: false,
      current: "SearchAll",
      currentModule: null,
      text: "",
      txt: "",
      moduleId: null,
      loading: false,
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
  },

  mounted() {
    this.getModuleData(this.$router.currentRoute.value.params.module);
  },
  components: {
    CompB,
    SearchAll,
    LoadingAnimation,
  },
  methods: {
    closeDropdown() {
      this.open = false;
    },
    openDropdown() {
      this.open = true;
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
  directives: {
    OnClickOutside: vOnClickOutside,
  },
};
</script>

<template>
  <header>
    <div v-bind:class="[{ active: open }, 'search-form']" v-on-click-outside="closeDropdown">
      <input type="text" @input="debounceSearch" @focusin="openDropdown" placeholder="Введите название" />
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
              <component :is="current" v-bind:text="this.text" v-bind:setLoading="setLoading" />
            </KeepAlive>
          </div>
          <LoadingAnimation v-if="this.loading" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import "@/assets/breakpoints.scss";
header {
  --border-radius: 5px;
  --padding: 13px;
  --bittons-transition: 0.4s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
  padding: var(--padding);
  color: var(--color-text-rev);
}

.search-form {
  display: flex;
  flex-direction: column;
  position: relative;
  width: min(650px, 100%);
  height: 100%;
}

.search-form input {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  padding: var(--padding);
  font-size: 1.3em;
  font-weight: 400;
  line-height: normal;
  border-radius: var(--border-radius);
  background-color: var(--vt-c-white);
  color: var(--vt-c-divider-dark-2);
  transition: color 0.2s;
}

.search-form input:active,
.search-form input:focus {
  outline: none;
}

.search-form.active input {
  color: var(--text-color);
}

.search-form .dropdown-container {
  position: absolute;
  top: calc(100% + 5px);
  width: 100%;
  display: flex;
  overflow: hidden;
  border-radius: var(--border-radius);
  z-index: 99;
}

.search-form .dropdown-container .dropdown-relative-container {
  position: relative;
  display: flex;
  width: 100%;
}

.search-form .search-dropdown {
  background-color: var(--vt-c-white);
  width: 100%;
  padding: var(--padding);
  z-index: 2;
}

.search-form .search-dropdown.loading {
  filter: blur(10px);
}

.search-dropdown .results {
  display: flex;
  flex-direction: column;
  position: relative;
}

.search-form .search-dropdown .tabs {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  background-color: var(--vt-c-text-dark-3);
  border-radius: 0.5rem;
  @include sm {
    grid-template-columns: repeat(2, 1fr);
  }

}


.search-form .search-dropdown .tabs label {
  padding: 5px;
  position: relative;
  text-align: center;
  user-select: none;
  transition: background-color var(--bittons-transition), color var(--bittons-transition);
  font-size: 1.3em;
  border-radius: 0.5rem;
}

.search-form .search-dropdown .tabs label.active {
  color: var(--color-text);
  background-color: var(--color-background-soft);
}

.search-form .search-dropdown .tabs label input {
  display: none;
}
</style>
