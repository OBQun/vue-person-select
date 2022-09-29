<template>
  <div id="app">
    <div>
      <person-select
        v-model="value"
        placeholder="单选"
        clearable
      ></person-select>
    </div>
    <div>
      <person-select
        v-model="values"
        multiple
        placeholder="多选"
      ></person-select>
    </div>
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
        values: [],
        value: null,
      };
    },
  };
</script>

<style>
  #app {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
  }
</style>
