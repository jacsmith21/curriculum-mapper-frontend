<template>
  <v-flex xs12>
    <v-divider></v-divider>
    <v-layout row wrap :style="{marginLeft: 0 + 'px'}">
      <template v-for="(item, index) in items">
        <slot v-bind:item="item" v-bind:index="index" v-bind:last-index="lastIndex(identifier, index)" v-bind:clickedIcon="clickedIcon"></slot>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'DynamicField',
    props: ['identifier', 'items'],
    computed: mapGetters(['lastIndex']),
    methods: {
      clickedIcon (key, index) {
        const that = this
        return () => {
          that.clickedDynamicInput({key: key, index: index})
        }
      },
      ...mapMutations(['clickedDynamicInput'])
    }
  }
</script>
