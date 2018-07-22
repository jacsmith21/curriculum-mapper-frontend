<template>
  <sidebar-base>
    <j-card-form title="Benchmark Form" object="benchmarks">
      <v-layout wrap>
        <j-text-field label="Name" v-model="name" xs12></j-text-field>
        <j-select label="Accreditor" v-model="accreditor" :items="items" xs12></j-select>
      </v-layout>
    </j-card-form>
  </sidebar-base>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  import SidebarBase from '@/views/SidebarBase'
  import JCardForm from '@/components/JCardForm'
  import { mapForm } from '@/_'
  import JSelect from '@/components/inputs/JSelect'

  export default {
    name: 'BenchmarkForm',
    components: {JSelect, SidebarBase, JCardForm, JTextField},
    data () {
      return {
        items: ['CAEB', 'CBEPS', 'IHO']
      }
    },
    computed: mapForm('forms.benchmarks.current')
  }
</script>

<style scoped>

</style>
