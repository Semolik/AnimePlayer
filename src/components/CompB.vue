<script>
export default {
  props: {
    text: String,
  },
  data() {
    return {
      msg: "",
    };
  },
  watch: {
    text() {
      console.log("upd 2");
    },
  },
};
</script>

<template>
  <p>Current component: B</p>
  <span>Message is: {{ msg }}</span>
  <input v-model="msg" />
</template>
