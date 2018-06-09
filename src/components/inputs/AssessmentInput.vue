<template>
  <v-flex xs12>
    <v-divider></v-divider>
    <v-layout row wrap :style="{marginLeft: 0 + 'px'}">
      <template v-for="(assessment, index) in assessments">
        <v-flex xs2 style="padding-left: 0">
          <v-select
            ref="type"
            :items="['Test', 'Lab', 'Assignment']"
            label="Type"
            single-line
            v-model="assessment.type"
          ></v-select>
        </v-flex>
        <v-flex xs10>
          <v-text-field
            label="Description"
            :append-icon="lastIndex('assessments', index) ? 'add' : 'close'"
            :append-icon-cb="() => { clickedDynamicInput({key: 'assessments', index: index}) }"
            v-model="assessment.description"
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
    name: 'AssessmentInput',
    props: ['identifier', 'label'],
    computed: {
      ...mapGetters(['lastIndex']),
      ...mapMultiRowFields(['form.assessments'])
    },
    methods: mapMutations(['clickedDynamicInput'])
  }
</script>

<style scoped>

</style>
