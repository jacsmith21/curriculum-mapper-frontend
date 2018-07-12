<template>
  <v-flex :class="classes">
    <v-text-field
      :label="label"
      v-model="content"
      :type="type"
      :append-icon="appendIcon"
      :append-icon-cb="appendIconCb"
      @input="input"
      :mask="mask"
      :suffix="suffix"
      :disabled="disabled"
    ></v-text-field>
  </v-flex>
</template>

<script>
  // import 'vuetify/src/stylus/components/_grid.styl'
  import { vmodel } from '@/mixins'

  export default {
    name: 'TextInput',
    mixins: [vmodel],
    props: {
      label: String,
      type: {default: 'text', type: String},
      appendIcon: String,
      appendIconCb: Function,
      mask: {required: false},
      suffix: {type: String},
      disabled: {default: false}
    }
  }
</script>

<style scoped>

</style>
