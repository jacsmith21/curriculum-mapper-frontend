<template>
  <v-layout>
    <List width="400"></List>
    <Form></Form>
  </v-layout>
</template>

<script>
  import Form from '@/components/Form.vue'
  import List from '@/components/List.vue'

  export default {
    name: 'Home',
    components: { Form, List }
  }
</script>
