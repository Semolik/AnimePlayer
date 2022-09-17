<template>
  <div class="module-titles-container">

    <div class="params">
      <div class="dropdown">
        <div class="item current" @click="OpenDropdown">Сортировка</div>
        <div :class="['close-click-area', { active: dropdownOpened }]" @click="CloseDropdown" />
        <div :class="['list', { open: dropdownOpened }]">
          <div class="line">
            <div class="label">Сортировка</div>
            <div :class="['progress', { loading: loading }]">
              <div class="icon in">
                <FontAwesomeIcon icon="fa-solid fa-spinner" />
              </div>
              <div class="icon end">
                <FontAwesomeIcon icon="fa-solid fa-check" class="loading-end-icon" />
              </div>
            </div>
            <div class="close" @click="CloseDropdown">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </div>
          </div>
          <div :class="['item', { active: item.value == current_sorting_value }]" :data-value="item.value"
            v-for="item in sorting_items" @click="setSortingItem(item.value)" v-wave>
            <div class="button-text">{{ item.name }}</div>
            <FontAwesomeIcon icon="fa-solid fa-angle-down" :class="{ reverse: revese_direction }" />
          </div>
        </div>
      </div>
    </div>
    <div class="titles-container" v-if="titles">
      <ModuleTitleItem :onlyLoading="loading" v-for="(title, key) in titles" :titleData="title" :key="key" />
    </div>
  </div>
</template>

<script>
import { HTTP } from "../http-common.vue";
import ModuleTitleItem from "./ModuleTitleItem.vue";
import { DetectErrorStatusCode } from '../composables/Errors.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark, faAngleDown, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
library.add([faXmark, faAngleDown, faSpinner, faCheck]);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    ModuleTitleItem,
    FontAwesomeIcon,

  },
  inject: ['moduleId'],
  data() {
    return {
      titles: [],
      pages: null,
      current_sorting_value: null,
      sorting_items: [],
      dropdownOpened: false,
      revese_direction: false,
      loading: false,
    };
  },
  methods: {
    setSortingItem(value) {
      if (this.current_sorting_value == value) {
        this.revese_direction = !this.revese_direction;
      } else {
        this.current_sorting_value = value;
        this.revese_direction = false;
      }
    },
    OpenDropdown() {
      this.dropdownOpened = true;
      document.body.style.overflow = 'hidden';
    },
    CloseDropdown() {
      this.dropdownOpened = false;
      document.body.style.overflow = null;
    },
    watch: {
      loading(status) {
        if (status === true) {
          this.fillTitles();
        }
      }
    },
    fillTitles() {
      this.titles = Array(20).fill({});
    },
    requestPage() {
      this.fillTitles();
      this.loading = true;
      var params = {};
      var current_sorting = this.current_sorting_value;
      if (current_sorting) {
        params['sort_by'] = current_sorting;
      }
      params['reverse_sort'] = this.revese_direction;
      HTTP.get(this.moduleId + "/", {
        params
      })
        .then((response) => {
          const { titles, pages, sorting } = response.data;
          this.titles = titles;
          this.pages = pages;
          this.sorting_items = sorting.items;
          if (!this.current_sorting_value) {
            this.current_sorting_value = sorting.default;
          }
        })
        .catch((error) => {
          // console.log(error);
          // console.log(error.response.status);
          // DetectErrorStatusCode(error);
          // this.setStatusCode(error.response.status);
          this.$emit('error', error);
        }).finally(() => {
          this.loading = false;
        });

    }
  },
  watch: {
    current_sorting_value() {
      this.requestPage();
    },
    revese_direction() {
      this.requestPage();
    }
  },
  mounted() {
    this.requestPage();
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/breakpoints";
$dropdown-transition: .3s;

.module-titles-container {
  max-width: calc(1500px + 2rem);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 0 auto;

  .titles-container {
    display: grid;
    gap: 10px;

    @include breakpoints.xs {
      grid-template-columns: repeat(2, 1fr);
    }

    @include breakpoints.sm {
      grid-template-columns: repeat(3, 1fr);
    }

    @include breakpoints.md {
      grid-template-columns: repeat(4, 1fr);
    }

    @include breakpoints.lg {
      grid-template-columns: repeat(5, 1fr);
    }

    @include breakpoints.xl {
      grid-template-columns: repeat(6, 1fr);
    }
  }
}

.params {
  display: flex;
  width: 100%;
  gap: 10px;
  margin-bottom: 15px;
  border-radius: 20px;

  @include breakpoints.sm {
    padding: 7px;
    margin-top: 10px;
    background-color: var(--color-background-mute);
  }
}

.params .dropdown {
  display: flex;
  width: 100%;
  touch-action: manipulation;

  .close-click-area {
    position: fixed;
    top: 0;
    left: 0;
    height: 0;
    width: 0;

    @include breakpoints.sm {
      display: none;
    }

    &.active {
      height: 100vh;
      width: 100vw;
      backdrop-filter: blur(10px) opacity(1);
      background-color: rgba($color: #000000, $alpha: 0.6);
      transition: height 0s ease-in 0s,
        width 0s ease-in 0s,
        background-color $dropdown-transition,
        backdrop-filter $dropdown-transition;
    }

    transition: backdrop-filter $dropdown-transition,
    background-color $dropdown-transition,
    height 0s ease-in $dropdown-transition,
    width 0s ease-in $dropdown-transition;
    backdrop-filter: blur(10px) opacity(0);
    background-color: rgba($color: #000000, $alpha: 0);
    z-index: 2;
  }

  @include breakpoints.sm(true) {
    flex-direction: column;
  }

  .line {
    display: none;
    padding: 10px;
    justify-content: right;
    align-items: center;

    @include breakpoints.sm(true) {
      display: flex;
    }

    .label {
      display: flex;
      align-items: center;
      font-size: 1.1em;
      font-weight: bold;
    }

    .progress {
      margin-left: 10px;
      position: relative;
      height: min-content;
      width: 12px;
      height: 100%;

      &.loading {
        .icon.in {
          opacity: 1;
        }


      }

      &:not(.loading) {
        .icon.end {
          animation: end 1s;
        }
      }

      .icon {
        position: absolute;
        width: 100%;
        height: 100%;
        display: grid;
        place-content: center;
        opacity: 0;
        transition: .2s opacity;

        svg {
          width: 100%;
          height: 100%;
        }

        &.end {
          opacity: 0;

          color: greenyellow;

          @keyframes end {
            0% {
              opacity: 1;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0;
            }
          }
        }

        &.in {
          svg {
            animation: spinner 1.2s linear infinite;
          }

          @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        }
      }
    }

    .close {
      margin-left: auto;

      svg {
        background-color: var(--color-background-mute);
        height: 25px;
        border-radius: 50%;
        width: 25px;
        padding: 5px;
        cursor: pointer;
      }
    }

  }

  input {
    display: none;
  }

  .item {
    padding: 7px 20px;
    border-radius: 20px;
    white-space: nowrap;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;

    svg {
      width: 0px;
      opacity: 0;
      transition: .2s opacity, .2s width, .2s transform;

      &.reverse {
        transform: rotate(180deg);
      }
    }

    &.active {
      cursor: auto;
      background-color: var(--color-background-mute-2);

      svg {
        width: 12px;
        opacity: 1;

        @include breakpoints.sm(true) {
          margin-left: auto;
        }
      }
    }

    @include breakpoints.sm {
      &:hover {
        background-color: var(--color-background-mute-2);
      }
    }

    &.current {
      @include breakpoints.sm {
        display: none;
      }

      margin-bottom: 12px;
      border-radius: 20px;
      color: var(--color-text);
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-background-mute-2);
    }
  }

  .list {
    width: 100%;

    .button {
      margin-top: 10px;
    }

    @include breakpoints.sm {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .button {
        display: none;
      }

      &>* {
        margin: 3px;
      }

      & {
        margin: -3px;
      }
    }

    @include breakpoints.sm(true) {
      display: grid;
      gap: 5px;
      border-radius: 10px 10px 0px 0px;
      overflow: hidden;
      transition: $dropdown-transition transform;
      z-index: 99;
      position: fixed;
      bottom: 0vh;
      transform: translate3d(0, 100%, 0);
      left: 0;
      background-color: var(--color-background-soft);
      padding: 10px;

      &:not(.open) {
        transform: translate3d(0, 100%, 0);
      }

      .item {
        padding: 15px;
        text-align: center;
      }

      &.open {
        transform: translate3d(0, 0, 0);
      }
    }
  }
}
</style>
