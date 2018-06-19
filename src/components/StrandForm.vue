<template>
  <v-container style="margin: 0">
  <v-layout row wrap>
  <v-flex xs12>
    <v-card>
      <v-card-text style="padding-top: 0">

        <v-card-title class="headline" primary-title>Benchmark</v-card-title>

        <v-form>
          <v-container fluid grid-list-xl>
            <v-layout row wrap>
              <text-input label="Name" v-model="name" xs12></text-input>
              <select-input label="Course" :items="courseItems" v-model="course"></select-input>
            </v-layout>
          </v-container>
        </v-form>

      </v-card-text>

      <v-divider class="mt-5"></v-divider>
      <v-card-actions>
        <v-btn flat>Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="submit">Submit</v-btn>
      </v-card-actions>

    </v-card>
  </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
  import TextInput from '@/components/inputs/TextInput'
  import DynamicField from '@/components/inputs/DynamicField'
  import SelectInput from '@/components/inputs/SelectInput'
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'StrandForm',
    components: { SelectInput, DynamicField, TextInput },
    computed: {
      ...mapFields(['benchmark.name', 'benchmark.course']),
      courseItems () {
        return this.$store.state.courses.map(course => course.name)
      }
    },
    methods: {
      submit () {
        this.$store.dispatch('addBenchmark').then(() => {
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }
</script>

<style scoped>

</style>
