<template>
  <div class="container">
    <div class="message-block">
      <div class="status-code">Код ошибки {{ status }}</div>
      <div class="message">{{ currentMessage }}</div>
      <router-link to="/" class="link">Вернуться на главную</router-link>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/breakpoints";

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px;

  .message-block {
    background-color: var(--color-background-soft);
    border-radius: 20px;
    padding: 10px;
    display: grid;
    gap: 10px;
    margin: 10px;
    max-width: 400px;
    width: 100%;

    .message {
      padding: 10px;

      @include breakpoints.rwd(400px) {
        font-size: 2em;
      }
    }

    .link {
      background-color: var(--color-background-mute);
      text-decoration: none;
      text-align: center;
      border-radius: 10px;
      color: var(--color-text);
      padding: 10px;
    }
  }
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
        500: "Ошибка сервера",
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
