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
        headline: 'Dr. MacIsaac',
        title: 'CS10' + i,
        subtitle: 'This is the ' + i + 'th index!'
      })
    }
    array.push({
      headline: 'Add a Course',
      title: 'Add a Course',
      subtitle: 'None'
    })
    return array
  }

  export default {
    name: 'Test',
    components: { Form, List },
    data () {
      return {
        form: {'name': '', 'number': '', 'instructor': '', 'description': ''},
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
          headline: this.form['instructor'],
          title: this.form['name'],
          subtitle: this.form['description']
        })
      }
    }
  }
</script>
