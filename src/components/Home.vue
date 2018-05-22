<template>
  <v-layout>
    <List width="400"></List>
    <CourseForm></CourseForm>
  </v-layout>
</template>

<script>
  import CourseForm from '@/components/CourseForm.vue'
  import List from '@/components/List.vue'

  export default {
    name: 'Home',
    components: { CourseForm, List }
  }
</script>
