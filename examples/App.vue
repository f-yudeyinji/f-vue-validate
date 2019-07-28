<template>
  <div id="app">
    <h1>这是该表单校验组件的demo</h1>
    <example></example>
  </div>
</template>

<script>
  import Example from './components/example.vue'

  export default {
  name: 'app',
  components: {
    Example
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
