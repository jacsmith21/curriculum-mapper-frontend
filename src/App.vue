<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list two-line>
        <template v-for="(item, index) in items">
          <v-list-tile
            ripple
            :key="item.title"
            :to="item.to"
            class="tile"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>


    <v-toolbar app clipped-left color="amber">
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-btn>
      <!--<v-btn class="headline" :ripple="false" flat v-text="title" to="/"></v-btn>-->
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/courses">Add Course</v-btn>
        <v-btn flat to="/benchmarks">Add Benchmark</v-btn>
        <v-btn flat to="/prerequisites">Prerequisite Graph</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <!--<v-navigation-drawer temporary :right="false" v-model="rightDrawer" fixed app>-->
      <!--<v-list>-->
        <!--<v-list-tile v-for="item in items" :key="item.title" @click="" :to="item.route">-->
          <!--<v-list-tile-action>-->
            <!--<v-icon>{{ item.icon }}</v-icon>-->
          <!--</v-list-tile-action>-->
          <!--<v-list-tile-content>-->
            <!--<v-list-tile-title>{{ item.title }}</v-list-tile-title>-->
          <!--</v-list-tile-content>-->
        <!--</v-list-tile>-->
      <!--</v-list>-->
    <!--</v-navigation-drawer>-->

    <v-footer :fixed="fixed" app>
      <v-layout column align-center>
        <span>&copy; 2018 Jacob Smith</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      open: true,
      miniVariant: false,
      rightDrawer: false,
      title: 'Curriculum Mapper'
    }
  },
  computed: {
    items () {
      return this.$store.state.courses.map(course => { return {title: course.name, headline: course.title || 'No Title', to: '/courses/' + course.name} })
    }
  },
  created () {
    this.$store.dispatch('loadCourses')
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style>
  .list__tile {
    font-weight: 400!important;
    font-size: 16px!important;
  }
</style>
