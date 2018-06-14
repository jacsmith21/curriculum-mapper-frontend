<template>
  <v-app>
    <v-toolbar app :clipped-left="clipped">
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-btn class="headline" :ripple="false" flat v-text="title" to="/"></v-btn>
      <!--<v-toolbar-title v-text="title"></v-toolbar-title>-->

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/courses">Add Course</v-btn>
        <v-btn flat to="/strands">Add Strand</v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-navigation-drawer temporary :right="false" v-model="rightDrawer" fixed app>
      <v-list>
        <v-list-tile v-for="item in items" :key="item.title" @click="" :to="item.route">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-footer :fixed="fixed" app>
      <v-layout column align-center>
        <span>&copy; 2018 Jacob Smith</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      open: true,
      items: [{
        icon: 'bubble_chart',
        title: 'PrerequisiteGraph',
        route: '/prerequisites'
      }],
      miniVariant: false,
      rightDrawer: false,
      title: 'Curriculum Mapper'
    }
  },
  name: 'App'
}
</script>
