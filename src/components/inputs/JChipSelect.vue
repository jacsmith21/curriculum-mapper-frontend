<template>
  <v-flex :class="classes">
    <v-autocomplete
      :items="items"
      :label="label"
      v-model="content"
      multiple
      chips
      deletable-chips
      @input="input"
    ></v-autocomplete>
  </v-flex>
</template>

<script>
  import { vmodel } from '@/mixins'

  export default {
    name: 'JChipSelect',
    props: ['items', 'label'],
    mixins: [vmodel]
  }
</script>
