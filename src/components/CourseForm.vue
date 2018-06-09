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
                  <v-flex xs12>
                    <v-text-field
                      label="Name"
                      v-model="name"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      label="Title"
                      v-model="title"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      label="Maintainer"
                      v-model="maintainer"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      label="Description"
                      v-model="description"
                    ></v-text-field>
                  </v-flex>

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
  import TextField from '@/components/inputs/TextField'
  import Prerequisites from '@/components/inputs/Prerequisites'
  import LearningOutcomes from '@/components/inputs/LearningOutcomes'
  import AssessmentInput from '@/components/inputs/AssessmentInput'
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'CourseForm',
    components: { LearningOutcomes, Prerequisites, TextField, AssessmentInput },
    data () {
      return {
        snackbar: false,
        defaultInput: TextField
      }
    },
    computed: mapFields(['form.name', 'form.title', 'form.maintainer', 'form.description']),
    methods: {
      submit () {
        this.$store.dispatch('addCourse')
        this.snackbar = true
      }
    }
  }
</script>
