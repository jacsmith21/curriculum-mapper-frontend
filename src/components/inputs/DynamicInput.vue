<template>
  <v-flex xs12>
    <v-divider></v-divider>
    <v-layout row wrap :style="{marginLeft: 0 + 'px'}">
      <template v-for="(_, index) in rows">
        <v-flex xs12 style="padding-left: 0px">
          <v-text-field
            label="Learning Outcome"
            :append-icon="index === lastIndex ? 'add' : 'close'"
            :append-icon-cb="() => { clicked(index) }"
            @input="(value) => { input(index, value) }"
          ></v-text-field>
        </v-flex>
      </template>
    </v-layout>
  </v-flex>
</template>

<script>
  import TextField from '@/components/inputs/TextField'

export default {
    name: 'DynamicInput',
    components: {TextField},
    props: ['identifier', 'label'],
    data () {
      return {
        rows: ['']
      }
    },
    computed: {
      lastIndex () {
        return this.rows.length - 1
      }
    },
    methods: {
      clicked (index) {
        console.log(index)
        if (index === this.lastIndex) {
          document.createElement('tr')
          this.rows.push('')
        } else {
          this.rows.splice(index, 1)
        }
      },
      input (index, value) {
        this.$store.commit('editForm', {key: this.identifier, value: value, index: index})
      }
    }
  }
</script>

<style scoped>

</style>
