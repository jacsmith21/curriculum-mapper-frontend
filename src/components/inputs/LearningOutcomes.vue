<template>
  <v-flex xs12>
    <v-divider></v-divider>
    <v-layout row wrap :style="{marginLeft: 0 + 'px'}">
      <template v-for="(outcome, index) in learningOutcomes">
        <v-flex xs12 style="padding-left: 0">
          <v-text-field
            label="Learning Outcome"
            v-model="outcome.value"
            :append-icon="lastIndex('learningOutcomes', index) ? 'add' : 'close'"
            :append-icon-cb="clickedIcon('learningOutcomes', index)"
          ></v-text-field>
        </v-flex>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import { mapMultiRowFields } from 'vuex-map-fields'
  import { dynamic } from '@/mixins'

  export default {
    name: 'LearningOutcomes',
    mixins: [dynamic],
    computed: mapMultiRowFields([`form.learningOutcomes`])
  }
</script>

<style scoped>

</style>
