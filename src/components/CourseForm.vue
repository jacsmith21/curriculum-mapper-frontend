<template>
  <v-container fluid :style="{margin: 0, overflow: 'auto', height: height + 'px'}">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>

          <v-card-title primary-title><div class="headline">Course Form</div></v-card-title>

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

                  <TextInput xs2 v-model="math" label="Math" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="naturalScience" label="Natural Science" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="complementaryStudies" label="Complementary Studies" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="engineeringScience" label="Engineering Science" type="number" suffix="%"></TextInput>
                  <TextInput xs2 v-model="engineeringDesign" label="Engineering Design" type="number" suffix="%"></TextInput>
                  <TextInput xs2 disabled></TextInput>

                  <TextInput v-model="inClass" label="Class Credit Hours" xs4 type="number"></TextInput>
                  <TextInput v-model="inLab" label="Lab Credit Hours" xs4 type="number"></TextInput>
                  <v-flex xs4><span>Total Credit Hours: {{ totalCreditHours }}</span></v-flex>

                  <SelectInput xs2 v-model="knowledgeBase" label="Knowledge Base" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="problemAnalysis" label="Problem Analysis" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="investigation" label="Investigation" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="design" label="Design" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="tools" label="Tools" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="team" label="Team" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="communication" label="Communication" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="professionalism" label="Professionalism" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="impacts" label="Impacts" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="ethics" label="Ethics" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="economics" label="Economics" :items="caebItems"></SelectInput>
                  <SelectInput xs2 v-model="ll" label="Lifelong Learning" :items="caebItems"></SelectInput>

                  <ChipSelect label="Prerequisites" :items="courseItems" v-model="prerequisites"></ChipSelect>

                  <DynamicField identifier="learningOutcomes" :items="learningOutcomes">
                    <!--suppress HtmlUnknownAttribute -->
                    <template slot-scope="{ item, index, lastIndex, clickedIcon }">
                      <TextInput
                        style="padding-left: 0"
                        xs12
                        label="Learning Outcome"
                        v-model="item.value"
                        :append-icon="lastIndex ? 'add' : 'close'"
                        :append-icon-cb="clickedIcon('learningOutcomes', index)"
                      ></TextInput>
                    </template>
                  </DynamicField>

                  <DynamicField identifier="assessments" :items="assessments">
                    <!--suppress HtmlUnknownAttribute -->
                    <template slot-scope="{ item, index, lastIndex, clickedIcon }">
                      <SelectInput xs2 :items="['Test', 'Lab', 'Assignment']" label="Type" v-model="item.assessmentType" style="padding-left: 0"></SelectInput>
                      <TextInput
                        xs10
                        label="Description"
                        v-model="item.description"
                        :append-icon="lastIndex ? 'add' : 'close'"
                        :append-icon-cb="clickedIcon('assessments', index)"
                      ></TextInput>
                    </template>
                  </DynamicField>

                  <DynamicField identifier="sections" :items="sections">
                    <!--suppress HtmlUnknownAttribute -->
                    <template slot-scope="{ item, index, lastIndex, clickedIcon }">
                      <TextInput style="padding-left: 0" label="Instructor" v-model="item.instructor" xs6></TextInput>
                      <TextInput
                        label="Section"
                        v-model="item.section"
                        :append-icon="lastIndex ? 'add' : 'close'"
                        :append-icon-cb="clickedIcon('sections', index)"
                        xs6
                      ></TextInput>
                    </template>
                  </DynamicField>

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
  // TODO: Refactor append-icon & append-icon-db. Move this to TextInput or a higher level component.
  import TextInput from '@/components/inputs/TextInput'
  import { mapFields, mapMultiRowFields } from 'vuex-map-fields'
  import SelectInput from '@/components/inputs/SelectInput'
  import ChipSelect from '@/components/inputs/ChipSelect'
  import DynamicField from '@/components/inputs/DynamicField'

  export default {
    name: 'CourseForm',
    components: { DynamicField, ChipSelect, SelectInput, TextInput },
    data () {
      return {
        snackbar: false,
        caebItems: ['I', 'D', 'A']
      }
    },
    computed: {
      totalCreditHours () {
        const inLab = parseInt(this.inLab) || 0
        const inClass = parseInt(this.inClass) || 0
        return inLab + inClass
      },
      height: function () {
        return window.innerHeight - 64 - 32
      },
      courseItems () {
        return this.$store.state.courses.map(course => course.name)
      },
      ...mapFields(
        [
          'name',
          'title',
          'maintainer',
          'description',
          'prerequisites',
          'percentFailure',
          'averageGrade',
          'inLab',
          'inClass',
          'auDistribution.math',
          'auDistribution.naturalScience',
          'auDistribution.complementaryStudies',
          'auDistribution.engineeringScience',
          'auDistribution.engineeringDesign',
          'caebAttributes.knowledgeBase',
          'caebAttributes.problemAnalysis',
          'caebAttributes.investigation',
          'caebAttributes.design',
          'caebAttributes.tools',
          'caebAttributes.team',
          'caebAttributes.communication',
          'caebAttributes.professionalism',
          'caebAttributes.impacts',
          'caebAttributes.ethics',
          'caebAttributes.economics',
          'caebAttributes.ll'
        ].map(field => `form.${field}`)),
      ...mapMultiRowFields([`form.learningOutcomes`, 'form.assessments', 'form.sections'])
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
