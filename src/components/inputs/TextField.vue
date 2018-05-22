<template>
  <v-text-field
    :label="label"
    @input="update"
  ></v-text-field>
</template>

<script>
  export default {
    name: 'TextField',
    props: ['identifier', 'label'],
    methods: {
      update (value) {
        this.$store.commit('editForm', {key: this.identifier, value: value})
      }
    }
  }
</script>

<style scoped>

</style>
