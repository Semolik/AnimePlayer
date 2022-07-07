<script>
export default {
  props: {
    data: Object,
    module_id: String,
  },
};
</script>

<template>
  <router-link
    :to="`/${this.module_id}/title/${this.data.id}`"
    class="autocomplete-item"
    @click="this.$parent.$parent.$parent.$parent.closeDropdown()"
  >
    <div class="poster">
      <img :src="this.data.poster" alt="" />
    </div>
    <div class="name">{{ this.data.name }}</div>
  </router-link>
</template>

<style>
.autocomplete-item {
  display: flex;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.2s;
  text-decoration: none;
  color: var(--text-color);
}
.autocomplete-item:hover {
  background-color: var(--vt-c-text-dark-3);
}
.autocomplete-item .name {
  width: 100%;
  font-size: 1.1em;
  line-height: 1.8rem;
}
.autocomplete-item .poster {
  width: 80px;
  height: 100px;
  overflow: hidden;
  border-radius: 5px;
  margin-right: 5px;
}
.autocomplete-item .poster img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
