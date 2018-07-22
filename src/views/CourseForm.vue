<template>
  <sidebar-base>
    <j-card-form title="Course Form" object="courses" :edit-item="course">

      <j-form-break title="Basic Information"></j-form-break>
      <v-layout wrap>
        <j-text-field v-model="number" label="Number" xs4></j-text-field>
        <j-text-field v-model="title" label="Title" xs6></j-text-field>
      </v-layout>


      <v-layout wrap>
        <j-text-field v-model="maintainer" label="Maintainer" xs10></j-text-field>
      </v-layout>

      <v-flex>
        <v-textarea v-model="description" label="Description"></v-textarea>
      </v-flex>

      <j-form-break title="Requisites"></j-form-break>
      <v-layout wrap>
        <j-text-field xs12 label="Prerequisites" v-model="prerequisites"></j-text-field>
        <j-text-field xs12 label="Recommended" v-model="recommended"></j-text-field>
        <j-text-field xs12 label="Corequisites" v-model="corequisites"></j-text-field>
      </v-layout>

      <j-form-break title="Accreditation"></j-form-break>
      <j-chip-select xs12 label="Benchmarks" :items="benchmarkItems" v-model="benchmarks"></j-chip-select>


      <j-form-break title="Course Content"></j-form-break>
      <j-form-break title="Learning Outcomes" tag="h3"></j-form-break>
      <v-layout wrap>
        <j-dynamic-field :items="learningOutcomes" identifier="form.learningOutcomes">
          <template slot-scope="{ item }">
            <j-text-field xs11 label="Learning Outcome" v-model="item.value"></j-text-field>
          </template>
        </j-dynamic-field>
      </v-layout>

      <j-form-break title="Assessments" tag="h3"></j-form-break>
      <v-layout wrap>
        <j-dynamic-field :items="assessments" identifier="form.assessments">
          <template slot-scope="{ item }">
            <j-select xs3 label="Type" :items="assessmentTypes" v-model="item.assessmentType"></j-select>
            <j-text-field xs8 label="Description" v-model="item.description"></j-text-field>
          </template>
        </j-dynamic-field>
      </v-layout>

      <j-form-break title="Instructors" tag="h3"></j-form-break>
      <v-layout wrap>
        <j-dynamic-field :items="sections" identifier="form.sections">
          <template slot-scope="{ item }">
            <j-text-field xs4 label="Instructor" v-model="item.instructor"></j-text-field>
            <j-text-field xs4 label="Section" v-model="item.section"></j-text-field>
            <j-text-field xs3 label="Section Count" type="number" v-model="item.section"></j-text-field>
          </template>
        </j-dynamic-field>
      </v-layout>

      <j-form-break title="CAEB Information"></j-form-break>
      <j-form-break title="Content Breakdown" tag="h3"></j-form-break>
      <v-layout wrap>
        <j-text-field xs4 v-model="math" label="Math" type="number" suffix="%"></j-text-field>
        <j-text-field xs4 v-model="naturalScience" label="Natural Science" type="number" suffix="%"></j-text-field>
        <j-text-field xs4 v-model="complementaryStudies" label="Complementary Studies" type="number" suffix="%"></j-text-field>
        <j-text-field xs4 v-model="engineeringScience" label="Engineering Science" type="number" suffix="%"></j-text-field>
        <j-text-field xs4 v-model="engineeringDesign" label="Engineering Design" type="number" suffix="%"></j-text-field>
      </v-layout>

      <j-form-break title="Credit Hours" tag="h3"></j-form-break>
      <v-layout wrap>
        <j-text-field v-model="inClass" label="Class Credit Hours" xs6 type="number"></j-text-field>
        <j-text-field v-model="inLab" label="Lab Credit Hours" xs6 type="number"></j-text-field>
      </v-layout>

      <j-form-break title="Grades" tag="h3"></j-form-break>
      <v-layout wrap>
        <j-text-field v-model="averageGrade" label="Average Grade" xs6></j-text-field>
        <j-text-field v-model="percentFailure" label="Percent Failure" type="number" xs6></j-text-field>
      </v-layout>

      <j-form-break title="Attributes" tag="h3"></j-form-break>
      <v-layout wrap>
        <j-select xs3 v-model="knowledgeBase" label="Knowledge Base" :items="caebItems"></j-select>
        <j-select xs3 v-model="problemAnalysis" label="Problem Analysis" :items="caebItems"></j-select>
        <j-select xs3 v-model="investigation" label="Investigation" :items="caebItems"></j-select>
        <j-select xs3 v-model="design" label="Design" :items="caebItems"></j-select>
        <j-select xs3 v-model="tools" label="Tools" :items="caebItems"></j-select>
        <j-select xs3 v-model="team" label="Team" :items="caebItems"></j-select>
        <j-select xs3 v-model="communication" label="Communication" :items="caebItems"></j-select>
        <j-select xs3 v-model="professionalism" label="Professionalism" :items="caebItems"></j-select>
        <j-select xs3 v-model="impacts" label="Impacts" :items="caebItems"></j-select>
        <j-select xs3 v-model="ethics" label="Ethics" :items="caebItems"></j-select>
        <j-select xs3 v-model="economics" label="Economics" :items="caebItems"></j-select>
        <j-select xs3 v-model="ll" label="Lifelong Learning" :items="caebItems"></j-select>
      </v-layout>

    </j-card-form>
  </sidebar-base>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  // import { mapFields, mapMultiRowFields } from 'vuex-map-fields'
  import { mapForm } from '@/_'
  import JSelect from '@/components/inputs/JSelect'
  import JChipSelect from '@/components/inputs/JChipSelect'
  import JDynamicField from '@/components/inputs/JDynamicField'
  import JFormBreak from '@/components/JFormBreak'
  import JCardForm from '@/components/JCardForm'
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'CourseForm',
    components: { SidebarBase, JCardForm, JFormBreak, JDynamicField, JChipSelect, JSelect, JTextField },
    data () {
      return {
        caebItems: ['I', 'D', 'A'],
        assessmentTypes: ['Test', 'Lab', 'Assignment']
      }
    },
    computed: {
      benchmarkItems () {
        return this.$store.state.benchmarks.map(benchmark => benchmark.name)
      },
      course () {
        const number = this.$route.params.name
        console.info(number)
        return this.$store.getters.courseNumberLookup[number]
      },
      ...mapForm('forms.courses.current')
    }
  }
</script>
