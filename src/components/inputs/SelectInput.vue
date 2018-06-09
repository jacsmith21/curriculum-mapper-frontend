<template>
  <v-flex xs2>
    <v-select
      :items="items"
      label="Type"
      single-line
      v-model="assessment.type"
    ></v-select>
  </v-flex>
</template>

<script>
  export default {
    name: 'SelectInput',
    props: ['items', 'label']
  }
</script>

<style scoped>

</style>
