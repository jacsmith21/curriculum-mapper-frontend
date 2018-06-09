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
            :append-icon-cb="() => { clickedDynamicInput({key: 'learningOutcomes', index: index}) }"
          ></v-text-field>
        </v-flex>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import { mapMultiRowFields } from 'vuex-map-fields'
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'LearningOutcomes',
    computed: {
      ...mapGetters(['lastIndex']),
      ...mapMultiRowFields([`form.learningOutcomes`])
    },
    methods: mapMutations(['clickedDynamicInput'])
  }
</script>

<style scoped>

</style>
