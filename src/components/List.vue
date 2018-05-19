<template>
  <v-layout :style="style">
    <div style="position: relative; width: 100%">
      <VueAutoVirtualScrollList class="list" :totalHeight="height" :defaultHeight="80">
        <template v-for="(item, index) in items">
          <v-list-tile
            :key="index"
            avatar
            ripple
            @click="toggle(index)"
            class="item"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </VueAutoVirtualScrollList>
    </div>
  </v-layout>
</template>

<script>
  import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'

  export default {
    name: 'List',
    components: {VueAutoVirtualScrollList},
    props: ['items', 'width', 'toggle'],
    computed: {
      style: function () {
        return {maxWidth: this.width + 'px', minWidth: this.width + 'px'}
      },
      height: function () {
        return window.innerHeight - 64 - 32  // Take off size of toolbar & footer
      }
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
