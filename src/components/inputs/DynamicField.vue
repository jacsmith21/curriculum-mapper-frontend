<template>
  <v-flex xs12>
    <v-layout row wrap :style="{marginLeft: 0 + 'px'}">
      <template v-for="(item, index) in items">
        <slot v-bind:item="item" v-bind:index="index" v-bind:last-index="items.length - 1 === index" v-bind:clickedIcon="clickedIcon"></slot>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'DynamicField',
    props: ['items'],
    methods: {
      clickedIcon (key, index, item) {
        item = item || 'form'
        const that = this
        return () => {
          that.clickedDynamicInput({key: key, index: index, item: item})
        }
      },
      ...mapMutations(['clickedDynamicInput'])
    }
  }
</script>
