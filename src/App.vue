<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer fixed app>
      <v-layout column align-center>
        <span>&copy; 2018 Jacob Smith</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    created () {
      this.$store.dispatch('loadCourses')
      this.$store.dispatch('loadBenchmarks')
    }
}
</script>
