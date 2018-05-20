<template>
  <v-layout>
    <List width="400" :toggle="toggle" :items="items"></List>
    <Form :form="form" :onSubmit="submit"></Form>
  </v-layout>
</template>

<script>
  import Form from '@/components/Form.vue'
  import List from '@/components/List.vue'
  import 'vuetify/src/stylus/components/_lists.styl'

  const getItems = (length) => {
    let array = []
    for (let i = 0; i < length; i++) {
      array.push({
        instructor: 'Dr. MacIsaac',
        name: 'CS10' + i,
        description: 'This is the ' + i + 'th index!'
      })
    }
    array.push({
      instructor: 'Add a Course',
      name: 'Add a Course',
      description: 'None'
    })
    return array
  }

  export default {
    name: 'Test',
    components: { Form, List },
    data () {
      return {
        form: {'Name': '', 'Instructor': '', 'Description': ''},
        items: getItems(8)
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
