<template>
  <v-flex xs12>
    <v-divider></v-divider>
    <v-layout row wrap :style="{marginLeft: 0 + 'px'}">
      <template v-for="(section, index) in sections">
        <TextInput style="padding-left: 0" label="Instructor" v-model="section.instructor" xs6></TextInput>
        <TextInput
          label="Section"
          v-model="section.section"
          :append-icon="lastIndex('sections', index) ? 'add' : 'close'"
          :append-icon-cb="() => { clickedDynamicInput({key: 'sections', index: index}) }"
          xs6
        ></TextInput>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import { mapMultiRowFields } from 'vuex-map-fields'
  import { mapMutations, mapGetters } from 'vuex'
  import TextInput from '@/components/inputs/TextInput'

  export default {
    name: 'SectionInput',
    components: {TextInput},
    props: ['identifier', 'label'],
    computed: {
      ...mapGetters(['lastIndex']),
      ...mapMultiRowFields(['form.sections'])
    },
    methods: mapMutations(['clickedDynamicInput'])
  }
</script>
