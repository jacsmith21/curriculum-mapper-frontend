<template>
  <v-layout>
    <List width="400" :toggle="toggle"></List>
    <Form :form="form" :onSubmit="submit"></Form>
  </v-layout>
</template>

<script>
  import Form from '@/components/Form.vue'
  import List from '@/components/List.vue'

  export default {
    name: 'Home',
    components: { Form, List },
    data () {
      return {
        form: {'Name': '', 'Instructor': '', 'Description': ''}
      }
    },
    methods: {
      toggle: function (index) {
        console.log('Toggle: ' + index)
      },
      submit: function () {
        console.log('Submitted!')

        this.items.push({
          instructor: this.form['Instructor'],
          name: this.form['Name'],
          description: this.form['Description']
        })
      }
    }
  }
</script>
