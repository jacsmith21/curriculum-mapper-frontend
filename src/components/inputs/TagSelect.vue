<template>
  <v-select
    :items="items"
    :label="label"
    chips
    tags
    deletable-chips
    @input="update"
  ></v-select>
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
