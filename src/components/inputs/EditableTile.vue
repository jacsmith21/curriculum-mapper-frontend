<template>
  <v-layout>

    <v-list-tile>
      <v-list-tile-action>
        <v-icon>{{ icon }}</v-icon>
      </v-list-tile-action>
      <input ref="input" v-show="edit" v-on:blur="finishedEdit" @keyup.enter="enter" :value="text">
      <v-list-tile-content @dblclick="doubleClick" v-show="!edit">
        <v-list-tile-title>{{ text }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-snackbar :bottom="true" :left="true" :timeout="6000" v-model="snackbar">
      Course modified!
      <v-btn flat icon @click="snackbar = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>

  </v-layout>
</template>

<script>
  import * as _ from '@/_'

  export default {
    name: 'EditableTile',
    props: ['icon', 'identifier', 'instance', 'dispatch', 'label'],
    data () {
      return {
        edit: false,
        snackbar: false
      }
    },
    computed: {
      input () {
        return this.$refs.input
      },
      text () {
        let text = this.instance[this.identifier]

        if (_.iterable(text)) {
          text = text.join(', ')
        }

        return text
      }
    },
    methods: {
      enter () {
        this.input.blur()
      },
      doubleClick () {
        this.edit = true
        this.$nextTick(() => this.$refs.input.focus())
      },
      finishedEdit () {
        this.edit = false
        this.$emit('update')
        this.$store.dispatch(this.dispatch, {instance: this.instance, key: this.identifier, value: this.input.value})
        this.snackbar = true
      }
    }
  }
</script>

<style scoped>

</style>
