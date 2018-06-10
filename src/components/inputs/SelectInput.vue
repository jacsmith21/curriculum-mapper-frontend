<template>
  <v-flex :class="classes">
    <v-select
      :items="items"
      v-model="content"
      :label="label"
      item-value="text"
      clearable
      @input="input"
    ></v-select>
  </v-flex>
</template>

<script>
  export default {
    name: 'SelectInput',
    props: ['items', 'label', 'value'],
    data () {
      return {
        content: this.value
      }
    },
    computed: {
      classes () {
        return Object.keys(this.$attrs).join(' ')
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
