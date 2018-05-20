<template>
  <v-layout :style="style">
    <div style="position: relative; width: 100%">
      <VueAutoVirtualScrollList class="list" :totalHeight="height" :defaultHeight="80">
        <template v-for="(course, index) in courses">
          <v-list-tile
            :key="index"
            avatar
            ripple
            :to="'/instructors/' + course.instructor + '/' + course.name"
            class="item"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ course.name }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ course.instructor }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ course.description }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </VueAutoVirtualScrollList>
    </div>
  </v-layout>
</template>

<script>
  import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'
  import { mapState } from 'vuex'

  export default {
    name: 'List',
    components: {VueAutoVirtualScrollList},
    props: ['width'],
    computed: {
      style: function () {
        return {maxWidth: this.width + 'px', minWidth: this.width + 'px'}
      },
      height: function () {
        return window.innerHeight - 64 - 32  // Take off size of toolbar & footer. I don't know any simple alternative.
      },
      ...mapState(['courses'])
    }
  }
</script>

<style>
  .item {
    border-bottom: 1px solid #eee;
  }

  /*This is to size of the items!*/
  /*noinspection CssUnusedSymbol*/
  .list__tile--avatar {
    height: 80px!important;
  }
</style>
