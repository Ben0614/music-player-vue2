<template>
  <div id="app">
    <router-link
      to="/MusicPlayer"
      class="musicPlayer"
    >MusicPlayer</router-link>
    <router-link
      to="/RepeatPlayer"
      class="repeatPlayer"
    >RepeatPlayer</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  margin-top: 60px;
}

.musicPlayer,
.repeatPlayer {
  font-size: 20px;
  text-decoration-line: none;
  color: #000;
}
.repeatPlayer {
  margin-left: 60px;
}
</style>
