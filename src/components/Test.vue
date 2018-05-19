<template>
  <div class="list-wrap">
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
    <Loading class="list-loading" :loading="loading"></Loading>
  </div>
</template>

<script>
  import Loading from '@/components/Loading.vue'
  import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'
  import 'vuetify/src/stylus/components/_lists.styl'

  const getList = (length) => {
    let array = []
    for (let i = 0; i < length; i++) {
      array.push({
        headline: 'Dr. MacIsaac',
        title: 'CS10' + i,
        subtitle: 'This is the ' + i + 'th index!'
      })
    }
    return array
  }

  export default {
    name: 'Test',
    components: { VueAutoVirtualScrollList, Loading },
    data () {
      return {
        loading: false,
        items: getList(8)
      }
    },
    computed: {
      height: function () {
        return window.innerHeight - 64 - 32  // Take off size of toolbar & footer
      }
    },
    methods: {
      toggle: function (index) {
        console.log('Toggle: ' + index)
      }
    }
  }
</script>

<style>
  .list-wrap {
    position: relative;
    width: 400px;
  }
  .list-loading {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .item {
    border-bottom: 1px solid #eee;
  }

  /*This is to size of the items!*/
  /*noinspection CssUnusedSymbol*/
  .list__tile--avatar {
    height: 80px!important;
  }
</style>
