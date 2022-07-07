<template>
  <div class="container">
    <div class="status-code">{{ status }}</div>
    <div class="message">{{ currentMessage }}</div>
    <router-link to="/">Вернуться на главную</router-link>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>

<script>
export default {
  props: {
    StatusCode: Number,
  },
  data() {
    return {
      messages: {
        404: "Страница не найдена",
        0: "Сервер не отвечает",
      },
      status: Number.isInteger(this.StatusCode) ? this.StatusCode : 404,
    };
  },
  computed: {
    currentMessage: (vm) => vm.messages[vm.status],
  },
};
</script>
