<template>
  <div>
    <div class="listWrap">
      <VirtualList class="list" :size="50" :remain="6" :tobottom="toBottom">
        <!--suppress JSUnusedLocalSymbols -->
        <Item v-for="(_, index) in items" :index="index" :key="index"></Item>
      </VirtualList>
      <Loading class="list-loading" :loading="loading"></Loading>
    </div>
  </div>
</template>

<script>
  import Item from '@/components/Item.vue'
  import Loading from '@/components/Loading.vue'
  import VirtualList from 'vue-virtual-scroll-list'
  const getList = (length) => {
    return new Array(length)
  }
  export default {
    name: 'Test',
    components: { Item, VirtualList, Loading },
    data () {
      return {
        loading: false,
        items: getList(20)
      }
    },
    methods: {
      toBottom () {
        if (!this.loading) {
          this.loading = true
          // Mock for requesting delay.
          setTimeout(() => {
            this.loading = false
            this.items = this.items.concat(getList(20))
          }, 2017)
        }
      }
    }
  }
</script>

<style scoped>
  .listWrap {
    position: relative;
  }
  .list-loading {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .list {
    background: #fff;
    border-radius: 3px;
    border: 1px solid #ddd;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }
</style>
