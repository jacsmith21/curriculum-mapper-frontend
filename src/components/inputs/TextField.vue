<template>
  <v-text-field
    :value="config['value']"
    :label="config['label']"
    @input="update"
  ></v-text-field>
</template>

<script>
  export default {
    name: 'TextField',
    props: ['identifier', 'config'],
    methods: {
      update (value) {
        this.$store.commit('editForm', {key: this.identifier, value: value})
      }
    }
  }
</script>

<style scoped>

</style>
