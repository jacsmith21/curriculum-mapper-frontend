<template>
  <v-flex xs12>
    <v-select
      :items="courseItems"
      label="Prerequisites"
      chips
      tags
      deletable-chips
      v-model="prerequisites"
    ></v-select>
  </v-flex>
</template>

<script>
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'Prerequisites',
    computed: {
      courseItems () {
        return this.$store.state.courses.map(course => course.name)
      },
      ...mapFields(['form.prerequisites'])
    }
  }
</script>

<style scoped>

</style>
