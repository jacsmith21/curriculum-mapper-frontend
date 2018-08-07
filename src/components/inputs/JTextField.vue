<template>
  <v-flex :class="classes">
    <v-text-field
      :label="label"
      v-model="content"
      :type="type"
      @input="input"
      :suffix="suffix"
      :disabled="disabled"
      :rules="rules"
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
      errorMessages: String,
      required: {type: Boolean, default: false},
      match: String
    },
    computed: {
      rules () {
        let rules = []
        if (this.required) {
          rules.push(s => !!s || `${this.label} is required.`)
        }
        if (this.match) {
          rules.push(s => s === this.match || `${this.label} does not match.`)
        }
        return rules
      }
    }
  }
</script>

<style scoped>

</style>
