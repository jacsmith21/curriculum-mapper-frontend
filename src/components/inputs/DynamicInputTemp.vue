<template>
  <v-layout wrap :style="{marginLeft: 0 + 'px'}">
    <template v-for="(row, index) in rows">
        <TextField label="Instructor" sm6></TextField>
        <TextField label="Section" sm6></TextField>
    </template>
    <div>
      <button class="button btn-primary" @click="addRow">Add row</button>
    </div>
  </v-layout>
</template>

<script>
  import TextField from '@/components/inputs/TextField'

export default {
    name: 'DynamicInput',
    components: {TextField},
    data () {
      return {
        rows: []
      }
    },
    methods: {
      addRow: function () {
        document.createElement('tr')
        this.rows.push({
          instructor: '',
          section: ''
        })
      },
      removeElement: function (index) {
        this.rows.splice(index, 1)
      }
    }
  }
</script>

<style scoped>

</style>
