<template>
  <v-toolbar app clipped-left clipped-right color="amber">
    <v-btn v-show="hamburger" icon @click.stop="() => $emit('barClick')">
      <v-icon>menu</v-icon>
    </v-btn>
    <v-toolbar-title>{{ title }}</v-toolbar-title>

    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat to="/courses">Add Course</v-btn>
      <v-btn flat to="/benchmarks">Add Benchmark</v-btn>
      <v-btn flat to="/visualize">Benchmark Graph</v-btn>
      <v-btn flat to="/prerequisites">Prerequisite Graph</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: {hamburger: Boolean},
    computed: mapState(['title'])
  }
</script>

<style scoped>

</style>
