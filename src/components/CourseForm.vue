<!--suppress HtmlUnknownAttribute -->
<template>
  <sidebar-base>
    <card-form title="Course Form" :submit="submit" snackbar-text="Course Added!">

      <SectionBreak title="Basic Information"></SectionBreak>
      <TextInput v-model="name" label="Name" xs12></TextInput>
      <TextInput v-model="title" label="Title" xs12></TextInput>
      <TextInput v-model="maintainer" label="Maintainer" xs12></TextInput>
      <TextInput v-model="description" label="Description" xs12></TextInput>

      <dynamic-field :items="prerequisites" identifier="form.prerequisites">
        <template slot-scope="{ item }">
          <select-input xs6 label="Prerequisite" :items="courseItems" v-model="item.prerequisite"></select-input>
          <select-input xs5 label="Alternative" :items="courseItems" v-model="item.alternative"></select-input>
        </template>
      </dynamic-field>
      <ChipSelect xs6 label="Recommended" :items="courseItems" v-model="recommended"></ChipSelect>
      <ChipSelect xs6 label="Corequisites" :items="courseItems" v-model="corequisites"></ChipSelect>
      <chip-select xs12 label="Benchmarks" :items="benchmarkItems" v-model="benchmarks"></chip-select>

      <SectionBreak title="Grades"></SectionBreak>
      <TextInput v-model="averageGrade" label="Average Grade" xs6></TextInput>
      <TextInput v-model="percentFailure" label="Percent Failure" type="number" xs6></TextInput>

      <SectionBreak title="Content Breakdown"></SectionBreak>
      <TextInput xs2 v-model="math" label="Math" type="number" suffix="%"></TextInput>
      <TextInput xs2 v-model="naturalScience" label="Natural Science" type="number" suffix="%"></TextInput>
      <TextInput xs2 v-model="complementaryStudies" label="Complementary Studies" type="number" suffix="%"></TextInput>
      <TextInput xs2 v-model="engineeringScience" label="Engineering Science" type="number" suffix="%"></TextInput>
      <TextInput xs2 v-model="engineeringDesign" label="Engineering Design" type="number" suffix="%"></TextInput>
      <TextInput xs2 disabled></TextInput>

      <SectionBreak title="Credit Hours"></SectionBreak>
      <TextInput v-model="inClass" label="Class Credit Hours" xs4 type="number"></TextInput>
      <TextInput v-model="inLab" label="Lab Credit Hours" xs4 type="number"></TextInput>
      <v-flex xs4><span>Total Credit Hours: {{ totalCreditHours }}</span></v-flex>


      <SectionBreak title="CAEB Attributes"></SectionBreak>
      <select-input xs2 v-model="knowledgeBase" label="Knowledge Base" :items="caebItems"></select-input>
      <select-input xs2 v-model="problemAnalysis" label="Problem Analysis" :items="caebItems"></select-input>
      <select-input xs2 v-model="investigation" label="Investigation" :items="caebItems"></select-input>
      <select-input xs2 v-model="design" label="Design" :items="caebItems"></select-input>
      <select-input xs2 v-model="tools" label="Tools" :items="caebItems"></select-input>
      <select-input xs2 v-model="team" label="Team" :items="caebItems"></select-input>
      <select-input xs2 v-model="communication" label="Communication" :items="caebItems"></select-input>
      <select-input xs2 v-model="professionalism" label="Professionalism" :items="caebItems"></select-input>
      <select-input xs2 v-model="impacts" label="Impacts" :items="caebItems"></select-input>
      <select-input xs2 v-model="ethics" label="Ethics" :items="caebItems"></select-input>
      <select-input xs2 v-model="economics" label="Economics" :items="caebItems"></select-input>
      <select-input xs2 v-model="ll" label="Lifelong Learning" :items="caebItems"></select-input>

      <section-break title="Learning Outcomes"></section-break>
      <dynamic-field :items="learningOutcomes" identifier="form.learningOutcomes">
        <template slot-scope="{ item }">
          <text-input xs11 label="Learning Outcome" v-model="item.value"></text-input>
        </template>
      </dynamic-field>

      <section-break title="Assessments"></section-break>
      <dynamic-field :items="assessments" identifier="form.assessments">
        <template slot-scope="{ item }">
          <select-input xs2 label="Type" :items="assessmentTypes" v-model="item.assessmentType"></select-input>
          <text-input xs9 label="Description" v-model="item.description"></text-input>
        </template>
      </dynamic-field>

      <section-break title="Instructors"></section-break>
      <dynamic-field :items="sections" identifier="form.sections">
        <template slot-scope="{ item }">
          <text-input xs6 label="Instructor" v-model="item.instructor"></text-input>
          <text-input xs5 label="Section" v-model="item.section"></text-input>
        </template>
      </dynamic-field>

    </card-form>
  </sidebar-base>
</template>

<script>
  import TextInput from '@/components/inputs/TextInput'
  import { mapFields, mapMultiRowFields } from 'vuex-map-fields'
  import SelectInput from '@/components/inputs/SelectInput'
  import ChipSelect from '@/components/inputs/ChipSelect'
  import DynamicField from '@/components/inputs/DynamicField'
  import SectionBreak from '@/components/SectionBreak'
  import CardForm from '@/components/CardForm'
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'CourseForm',
    components: { SidebarBase, CardForm, SectionBreak, DynamicField, ChipSelect, SelectInput, TextInput },
    data () {
      return {
        snackbar: false,
        caebItems: ['I', 'D', 'A'],
        assessmentTypes: ['Test', 'Lab', 'Assignment']
      }
    },
    computed: {
      totalCreditHours () {
        const inLab = parseInt(this.inLab) || 0
        const inClass = parseInt(this.inClass) || 0
        return inLab + inClass
      },
      courseItems () {
        return this.$store.state.courses.map(course => course.name)
      },
      benchmarkItems () {
        return this.$store.state.benchmarks.map(benchmark => benchmark.name)
      },
      ...mapFields(
        [
          'name',
          'title',
          'maintainer',
          'description',
          'corequisites',
          'recommended',
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
          'caebAttributes.ll',
          'benchmarks'
        ].map(field => `form.${field}`)),
      ...mapMultiRowFields([`form.learningOutcomes`, 'form.assessments', 'form.sections', 'form.prerequisites'])
    },
    methods: {
      submit () {
        this.$store.dispatch('addCourse').then(() => {
          this.snackbar = true
        }).catch(err => {
          console.error(err)
        })
      }
    },
    mounted () {
      this.$store.state.displayCourses = true
    }
  }
</script>
