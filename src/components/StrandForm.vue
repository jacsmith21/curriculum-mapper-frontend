<template>
  <sidebar-base>
    <card-form title="Course Form" :submit="submit" snackbar-text="Benchmark Added!">
      <text-input label="Name" v-model="name" xs12></text-input>
    </card-form>
  </sidebar-base>
</template>

<script>
  import TextInput from '@/components/inputs/TextInput'
  import SidebarBase from '@/views/SidebarBase'
  import CardForm from '@/components/CardForm'
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'StrandForm',
    components: { SidebarBase, CardForm, TextInput },
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
