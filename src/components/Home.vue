<template>
  <v-layout>
    <CourseForm></CourseForm>
  </v-layout>
</template>

<script>
  import CourseForm from '@/components/CourseForm.vue'

  export default {
    name: 'Home',
    components: { CourseForm }
  }
</script>
