<template>
  <v-flex :class="classes">
    <v-text-field
      :label="label"
      v-model="content"
      :type="type"
      @input="input"
      :suffix="suffix"
      :disabled="disabled"
      :error-messages="errorMessages"
      required
    ></v-text-field>
  </v-flex>
</template>

<script>
  import { vmodel } from '@/mixins'

  export default {
    name: 'JTextField',
    mixins: [vmodel],
    props: {
      label: String,
      type: {default: 'text', type: String},
      suffix: {type: String},
      disabled: {default: false},
      errorMessages: String
    }
  }
</script>

<style scoped>

</style>
