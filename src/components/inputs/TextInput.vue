<template>
  <v-flex xs12>
    <v-text-field
      :label="label"
      v-model="content"
      @input="input"
    ></v-text-field>
  </v-flex>
</template>

<script>
  export default {
    name: 'TextInput',
    props: ['value', 'label'],
    data () {
      return {
        content: this.value
      }
    },
    methods: {
      input () {
        this.$emit('input', this.content)
      }
    }
  }
</script>

<style scoped>

</style>
