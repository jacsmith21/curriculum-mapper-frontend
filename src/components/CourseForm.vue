<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>

          <v-card-title primary-title><div class="headline">Courses Form</div></v-card-title>

          <v-card-text>
            <v-form>
              <v-container grid-list-xl fluid>
                <v-layout wrap>
                  <TextInput v-model="name" label="Name"></TextInput>
                  <TextInput v-model="title" label="Title"></TextInput>
                  <TextInput v-model="maintainer" label="Maintainer"></TextInput>
                  <TextInput v-model="description" label="Description"></TextInput>

                  <LearningOutcomes></LearningOutcomes>
                  <Prerequisites></Prerequisites>
                  <AssessmentInput></AssessmentInput>
                  <!--<TextField sm6 label="Class Hours"></TextField>-->
                  <!--<TextField sm6 label="Lab Hours"></TextField>-->
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

    <v-snackbar :bottom="true" :left="true" :timeout="6000" v-model="snackbar">
      Course added!
      <v-btn flat icon @click="snackbar = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>

  </v-container>
</template>

<script>
  import Prerequisites from '@/components/inputs/Prerequisites'
  import LearningOutcomes from '@/components/inputs/LearningOutcomes'
  import AssessmentInput from '@/components/inputs/AssessmentInput'
  import TextInput from '@/components/inputs/TextInput'
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'CourseForm',
    components: { LearningOutcomes, Prerequisites, AssessmentInput, TextInput },
    data () {
      return {
        snackbar: false
      }
    },
    computed: mapFields(['form.name', 'form.title', 'form.maintainer', 'form.description']),
    methods: {
      submit () {
        this.$store.dispatch('addCourse').then(() => {
          this.snackbar = true
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }
</script>
