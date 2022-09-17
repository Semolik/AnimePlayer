<template>
    <div :class="['theme', themeData.value, { active: active }, { absolute: !setTheme }]"
        @[setTheme&&`click`]="setTheme(themeData.value)">
        <div class="search-line"></div>
        <div class="titles">
            <div class="title" v-for="_ in 5 * 3"></div>
        </div>
        <div class="theme-name">
            <FontAwesomeIcon icon="fa-solid fa-check" />
            {{ themeData.name }}
        </div>
    </div>
</template>
<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
library.add(faCheck);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export default {
    props: {
        setTheme: Function,
        themeData: Object,
        active: Boolean,
    },
    components: {
        FontAwesomeIcon,
    },
}
</script>
<style lang="scss">
.theme {
    padding: 10px;
    height: 150px;
    width: 200px;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);

    border-width: 2px;
    border-style: solid;
    border-color: transparent;
    transition: .2s border-color;

    &.absolute {
        position: absolute;
    }

    &.active {
        border-color: var(--accent);

        .theme-name svg {
            width: 14px;
        }
    }

    .search-line {
        background-color: var(--mute);
        height: 15px;
        border-radius: 5px;
        margin-bottom: 8px;
    }

    .titles {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 3px;
        height: 100%;
        width: 80%;
        margin: auto;

        .title {
            background-color: var(--mute);
            border-radius: 5px;
            position: relative;
            margin-bottom: 6px;

            &::after {
                content: '';
                position: absolute;
                height: 4px;
                background-color: var(--mute);
                border-radius: 10px;
                left: 0;
                right: 0;
                margin: auto;
                width: 80%;
                bottom: -6px;
            }
        }
    }

    .theme-name {
        position: absolute;
        top: 100%;
        margin-top: 10px;

        svg {
            width: 0px;
            transition: .2s width;
        }
    }

    &.light {
        --bg: var(--light-theme-background);
        --soft: var(--light-theme-soft);
        --mute: var(--light-theme-mute);
        --mute-2: var(--light-theme-mute-2);
    }

    &.dark {
        --bg: var(--dark-theme-background);
        --soft: var(--dark-theme-soft);
        --mute: var(--dark-theme-mute);
        --mute-2: var(--dark-theme-mute-2);
    }

    &.auto {
        background-color: red;
    }
}
</style>