<template>
  <v-flex :xs12="xs12" :xs6="xs6">
    <v-text-field
      :label="label"
      v-model="content"
      :type="type"
      :append-icon="appendIcon"
      :append-icon-cb="appendIconCb"
      @input="input"
    ></v-text-field>
  </v-flex>
</template>

<script>
  export default {
    name: 'TextInput',
    props: {
      value: {required: false},
      label: String,
      type: {default: 'text', type: String},
      appendIcon: String,
      appendIconCb: Function,
      xs6: {required: false}
    },
    data () {
      return {
        content: this.value
      }
    },
    computed: {
      xs12 () {
        return !(this.xs6 === '')
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
