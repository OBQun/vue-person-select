<template>
  <div id="app">
    <person-select v-model="value"></person-select>
  </div>
</template>

<script>
import PersonSelect from "./PersonSelect";
export default {
  name: "App",
  components: {
    PersonSelect,
  },
  data() {
    return {
      value: "",
    };
  },
};
</script>

<style>
</style>
