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

  export default {
    name: 'TextInput',
    props: {
      value: {required: false},
      label: String,
      type: {default: 'text', type: String},
      appendIcon: String,
      appendIconCb: Function,
      mask: {required: false},
      suffix: {type: String},
      disabled: {default: false}
    },
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
