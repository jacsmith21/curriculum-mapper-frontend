<template>
  <v-flex xs12 style="padding-left: 0">
    <v-layout row wrap style="margin-left: 0">
      <template v-for="(item, index) in items">
        <slot v-bind:item="item" v-bind:index="index" v-bind:last-index="items.length - 1 === index" v-bind:clickedIcon="clickedDynamicInput"></slot>

        <v-flex xs1>
          <!--suppress JSCheckFunctionSignatures -->
          <v-btn flat :style="btnStyle" icon @click="clickedDynamicInput({key: identifier, index: index})">
            <v-icon v-if="items.length - 1 === index">add</v-icon>
            <v-icon v-else>close</v-icon>
          </v-btn>
        </v-flex>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'DynamicField',
    props: ['items', 'identifier'],
    data () {
      return {
        btnStyle: {
          marginTop: '16px'
        }
      }
    },
    methods: mapMutations(['clickedDynamicInput'])
  }
</script>
