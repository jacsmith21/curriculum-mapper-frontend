<template>
  <div>
    <div class="list-wrap">
      <VueAutoVirtualScrollList :totalHeight="height" :defaultHeight="80" style="width: 100%;">
        <!--suppress JSUnusedLocalSymbols -->
        <Item v-for="(_, index) in items" :index="index" :key="index"></Item>
      </VueAutoVirtualScrollList>
      <Loading class="list-loading" :loading="loading"></Loading>
    </div>
  </div>
</template>

<script>
  import Item from '@/components/Item.vue'
  import Loading from '@/components/Loading.vue'
  import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'

  const getList = (length) => {
    return new Array(length)
  }

  export default {
    name: 'Test',
    components: { Item, VueAutoVirtualScrollList, Loading },
    data () {
      return {
        loading: false,
        items: getList(6)
      }
    },
    computed: {
      height: function () {
        return window.innerHeight - 64 - 32  // Take off size of toolbar & footer
      }
    },
    mounted () {
      console.log(this.$el.clientHeight)
    }
  }
</script>

<style scoped>
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
</style>
