<template>
  <v-flex xs12>
    <v-select
      :items="items"
      :label="label"
      chips
      tags
      deletable-chips
      @input="update"
    ></v-select>
  </v-flex>
</template>

<script>
  export default {
    name: 'TagSelect',
    props: ['items', 'label', 'identifier'],
    methods: {
      update (value) {
        this.$store.commit('editForm', {key: this.identifier, value: value})
      }
    }
  }
</script>

<style scoped>

</style>
