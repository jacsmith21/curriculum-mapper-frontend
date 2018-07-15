<template>
  <sidebar-base>
    <j-card-form title="Benchmark Form" :submit="submit">
      <j-text-field label="Name" v-model="name" xs12></j-text-field>
      <j-select label="Accreditor" v-model="accreditor" :items="['CAEB', 'CBEPS', 'IHO']" xs12></j-select>
    </j-card-form>
  </sidebar-base>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  import SidebarBase from '@/views/SidebarBase'
  import JCardForm from '@/components/JCardForm'
  import { mapFields } from 'vuex-map-fields'
  import JSelect from '@/components/inputs/JSelect'

  export default {
    name: 'BenchmarkForm',
    components: { JSelect, SidebarBase, JCardForm, JTextField },
    computed: mapFields(['benchmark.name', 'benchmark.accreditor']),
    methods: {
      submit () {
        this.$store.dispatch('addBenchmark').then(() => {
        }).catch(err => {
          console.error(err)
        })
      }
    },
    mounted () {
      this.$store.state.displayCourses = false
    }
  }
</script>

<style scoped>

</style>
