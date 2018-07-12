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
  import { vmodel } from '@/mixins'

  export default {
    name: 'SelectInput',
    mixins: [vmodel],
    props: ['items', 'label']
  }
</script>
