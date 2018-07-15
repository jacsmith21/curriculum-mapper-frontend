<template>
  <sidebar-base>
    <j-card-form title="Course Form" :submit="submit" snackbar-text="Course Added!" :submit-text="edit ? 'Save' : 'Submit'">

      <j-form-break title="Basic Information"></j-form-break>
      <j-text-field v-model="name" label="Name" xs12></j-text-field>
      <j-text-field v-model="title" label="Title" xs12></j-text-field>
      <j-text-field v-model="maintainer" label="Maintainer" xs12></j-text-field>
      <j-text-field v-model="description" label="Description" xs12></j-text-field>

      <j-text-field xs12 label="Prerequisites" v-model="prerequisites"></j-text-field>
      <j-text-field xs12 label="Recommended" v-model="recommended"></j-text-field>
      <j-text-field xs12 label="Corequisites" v-model="corequisites"></j-text-field>
      <j-chip-select xs12 label="Benchmarks" :items="benchmarkItems" v-model="benchmarks"></j-chip-select>

      <j-form-break title="Grades"></j-form-break>
      <j-text-field v-model="averageGrade" label="Average Grade" xs6></j-text-field>
      <j-text-field v-model="percentFailure" label="Percent Failure" type="number" xs6></j-text-field>

      <j-form-break title="Content Breakdown"></j-form-break>
      <j-text-field xs2 v-model="math" label="Math" type="number" suffix="%"></j-text-field>
      <j-text-field xs2 v-model="naturalScience" label="Natural Science" type="number" suffix="%"></j-text-field>
      <j-text-field xs2 v-model="complementaryStudies" label="Complementary Studies" type="number" suffix="%"></j-text-field>
      <j-text-field xs2 v-model="engineeringScience" label="Engineering Science" type="number" suffix="%"></j-text-field>
      <j-text-field xs2 v-model="engineeringDesign" label="Engineering Design" type="number" suffix="%"></j-text-field>
      <j-text-field xs2 disabled></j-text-field>

      <j-form-break title="Credit Hours"></j-form-break>
      <j-text-field v-model="inClass" label="Class Credit Hours" xs4 type="number"></j-text-field>
      <j-text-field v-model="inLab" label="Lab Credit Hours" xs4 type="number"></j-text-field>
      <v-flex xs4><span>Total Credit Hours: {{ totalCreditHours }}</span></v-flex>


      <j-form-break title="CAEB Attributes"></j-form-break>
      <j-select xs2 v-model="knowledgeBase" label="Knowledge Base" :items="caebItems"></j-select>
      <j-select xs2 v-model="problemAnalysis" label="Problem Analysis" :items="caebItems"></j-select>
      <j-select xs2 v-model="investigation" label="Investigation" :items="caebItems"></j-select>
      <j-select xs2 v-model="design" label="Design" :items="caebItems"></j-select>
      <j-select xs2 v-model="tools" label="Tools" :items="caebItems"></j-select>
      <j-select xs2 v-model="team" label="Team" :items="caebItems"></j-select>
      <j-select xs2 v-model="communication" label="Communication" :items="caebItems"></j-select>
      <j-select xs2 v-model="professionalism" label="Professionalism" :items="caebItems"></j-select>
      <j-select xs2 v-model="impacts" label="Impacts" :items="caebItems"></j-select>
      <j-select xs2 v-model="ethics" label="Ethics" :items="caebItems"></j-select>
      <j-select xs2 v-model="economics" label="Economics" :items="caebItems"></j-select>
      <j-select xs2 v-model="ll" label="Lifelong Learning" :items="caebItems"></j-select>

      <j-form-break title="Learning Outcomes"></j-form-break>
      <j-dynamic-field :items="learningOutcomes" identifier="form.learningOutcomes">
        <template slot-scope="{ item }">
          <j-text-field xs11 label="Learning Outcome" v-model="item.value"></j-text-field>
        </template>
      </j-dynamic-field>

      <j-form-break title="Assessments"></j-form-break>
      <j-dynamic-field :items="assessments" identifier="form.assessments">
        <template slot-scope="{ item }">
          <j-select xs2 label="Type" :items="assessmentTypes" v-model="item.assessmentType"></j-select>
          <j-text-field xs9 label="Description" v-model="item.description"></j-text-field>
        </template>
      </j-dynamic-field>

      <j-form-break title="Instructors"></j-form-break>
      <j-dynamic-field :items="sections" identifier="form.sections">
        <template slot-scope="{ item }">
          <j-text-field xs6 label="Instructor" v-model="item.instructor"></j-text-field>
          <j-text-field xs5 label="Section" v-model="item.section"></j-text-field>
        </template>
      </j-dynamic-field>

    </j-card-form>
  </sidebar-base>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  import { mapFields, mapMultiRowFields } from 'vuex-map-fields'
  import JSelect from '@/components/inputs/JSelect'
  import JChipSelect from '@/components/inputs/JChipSelect'
  import JDynamicField from '@/components/inputs/JDynamicField'
  import JFormBreak from '@/components/JFormBreak'
  import JCardForm from '@/components/JCardForm'
  import SidebarBase from '@/views/SidebarBase'
  import { router } from '@/router'

  export default {
    name: 'CourseForm',
    components: { SidebarBase, JCardForm, JFormBreak, JDynamicField, JChipSelect, JSelect, JTextField },
    props: {edit: {type: Boolean, default: false}},
    data () {
      return {
        caebItems: ['I', 'D', 'A'],
        assessmentTypes: ['Test', 'Lab', 'Assignment'],
        course: null
      }
    },
    computed: {
      totalCreditHours () {
        const inLab = parseInt(this.inLab) || 0
        const inClass = parseInt(this.inClass) || 0
        return inLab + inClass
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
          'prerequisites',
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
      ...mapMultiRowFields([`form.learningOutcomes`, `form.assessments`, `form.sections`])
    },
    methods: {
      submit () {
        if (this.edit) {
          this.$store.dispatch('patchCourse', this.course)
            .then(() => {
              router.go(-1)
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          this.$store.dispatch('addCourse')
            .catch(err => {
              console.error(err)
            })
        }
      }
    },
    mounted () {
      this.$store.state.displayCourses = true
    },
    created () {
      if (this.edit) {
        this.course = this.$store.getters.courseNameLookup[this.$route.params.name]
        this.$store.commit('resetForm', this.course)
      } else {
        this.$store.commit('resetForm')
      }
    }
  }
</script>
