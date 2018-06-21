<template>
  <v-flex :class="classes">
    <v-select
      :items="items"
      :label="label"
      multiple
      chips
      deletable-chips
      autocomplete
      @input="input"
    ></v-select>
  </v-flex>
</template>

<script>
  import { vmodel } from '@/mixins'

  export default {
    name: 'ChipSelect',
    props: ['items', 'label'],
    mixins: [vmodel],
    computed: {
      classes () {
        return Object.keys(this.$attrs).join(' ')
      }
    }
  }
</script>

<style scoped>

</style>
