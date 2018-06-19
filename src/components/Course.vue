<template>
  <v-layout>
    <CourseCard></CourseCard>
  </v-layout>
</template>

<script>
  import CourseCard from '@/components/CourseCard.vue'

  export default {
    name: 'Courses',
    components: { CourseCard }
  }
</script>

<style scoped>

</style>
