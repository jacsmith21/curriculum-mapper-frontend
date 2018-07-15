<template>
  <sidebar-base>
    <j-card-form title="Benchmark Form" :submit="submit">
      <j-text-field label="Name" v-model="name" xs12></j-text-field>
    </j-card-form>
  </sidebar-base>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  import SidebarBase from '@/views/SidebarBase'
  import JCardForm from '@/components/JCardForm'
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'BenchmarkForm',
    components: { SidebarBase, JCardForm, JTextField },
    computed: mapFields(['benchmark.name']),
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
