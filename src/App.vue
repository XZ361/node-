<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  //通过export进行导出
export default {
  name: 'App'
}
</script>

<style scoped="scoped">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>
