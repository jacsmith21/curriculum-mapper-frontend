<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="40"
    :return-value.sync="content"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
    :style="style"
  >
    <v-text-field
      slot="activator"
      v-model="content"
      :label="label"
      prepend-icon="event"
    ></v-text-field>
    <v-date-picker v-model="content" @input="handleInput"></v-date-picker>

  </v-menu>
</template>

<script>
  import { vmodel } from '@/mixins'

  export default {
    name: 'Date',
    props: {
      width: {type: Number, default: 300},
      label: {type: String, default: 'Choose Date'}
    },
    mixins: [vmodel],
    data () {
      return {
        menu: false
      }
    },
    computed: {
      style () {
        return {
          marginLeft: '10px',
          width: `${this.width}px`
        }
      }
    },
    methods: {
      handleInput (date) {
        this.$refs.menu.save(date)
        this.input()
      }
    }
  }
</script>

<style scoped>

</style>
