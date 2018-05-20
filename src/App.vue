<template>
  <v-app style="max-height: 100%">
    <v-toolbar app :clipped-left="clipped">
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-btn class="headline" :ripple="false" flat v-text="title" to="/"></v-btn>
      <!--<v-toolbar-title v-text="title"></v-toolbar-title>-->
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-navigation-drawer temporary :right="right" v-model="rightDrawer" fixed app>
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
        <span>&copy; 2017 Jacob Smith</span>
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
      items: [{
        icon: 'bubble_chart',
        title: 'Test',
        route: '/test'
      }],
      miniVariant: false,
      right: false,
      rightDrawer: false,
      title: 'Curriculum Mapper'
    }
  },
  name: 'App'
}
</script>

<style>
  html, body {margin:0;padding:0;height:100%;}
  {box-sizing:border-box;}
</style>
