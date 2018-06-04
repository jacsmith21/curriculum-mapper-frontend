<template>
  <v-flex xs12>
    <v-text-field
      :label="label"
      @input="update"
    ></v-text-field>
  </v-flex>
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

