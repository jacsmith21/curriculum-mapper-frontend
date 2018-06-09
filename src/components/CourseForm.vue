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
                  <TextInput v-model="name" label="Name" xs12></TextInput>
                  <TextInput v-model="title" label="Title" xs12></TextInput>
                  <TextInput v-model="maintainer" label="Maintainer" xs12></TextInput>
                  <TextInput v-model="description" label="Description" xs12></TextInput>
                  <TextInput v-model="averageGrade" label="Average Grade" xs6></TextInput>
                  <TextInput v-model="percentFailure" label="Percent Failure" type="number" xs6></TextInput>

                  <TextInput xs2 v-model="auDistribution.math" label="Math" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="auDistribution.naturalScience" label="Natural Science" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="auDistribution.complementaryStudies" label="Complementary Studies" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="auDistribution.engineeringDesign" label="Engineering Science" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="auDistribution.engineeringDesign" label="Engineering Design" type="number" suffix="%"></TextInput>
                  <TextInput xs2 disabled></TextInput>

                  <TextInput v-model="inClass" label="Class Credit Hours" xs4 type="number"></TextInput>
                  <TextInput v-model="inLab" label="Lab Credit Hours" xs4 type="number"></TextInput>
                  <v-flex xs4><span>Total Credit Hours: {{ totalCreditHours }}</span></v-flex>


                  <Prerequisites></Prerequisites>

                  <LearningOutcomes></LearningOutcomes>
                  <AssessmentInput></AssessmentInput>
                  <SectionInput></SectionInput>
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
  import SectionInput from '@/components/inputs/SectionInput'
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'CourseForm',
    components: { LearningOutcomes, Prerequisites, AssessmentInput, TextInput, SectionInput },
    data () {
      return {
        snackbar: false
      }
    },
    computed: {
      totalCreditHours () {
        const inLab = parseInt(this.inLab) || 0
        const inClass = parseInt(this.inClass) || 0
        return inLab + inClass
      },
      ...mapFields(
        [
          'name',
          'title',
          'maintainer',
          'description',
          'percentFailure',
          'averageGrade',
          'inLab',
          'inClass',
          'auDistribution'
        ].map(field => `form.${field}`))
    },
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
