<template>
  <v-flex xs12>
    <v-divider></v-divider>
    <v-layout row wrap :style="{marginLeft: 0 + 'px'}">
      <template v-for="(item, index) in value">
        <v-flex xs12 style="padding-left: 0">
          <v-text-field
            :label="label"
            v-model="item.value"
            :append-icon="lastIndex(identifier, index) ? 'add' : 'close'"
            :append-icon-cb="clickedIcon(identifier, index)"
          ></v-text-field>
        </v-flex>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import { vmodel, dynamic } from '@/mixins'

  export default {
    name: 'ListField',
    props: ['label', 'identifier'],
    mixins: [vmodel, dynamic]
  }
</script>
