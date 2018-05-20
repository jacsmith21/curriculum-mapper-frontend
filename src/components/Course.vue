<template>
  <v-layout>
    <List width="400"></List>
    <CourseCard></CourseCard>
  </v-layout>
</template>

<script>
  import List from '@/components/List.vue'
  import CourseCard from '@/components/CourseCard.vue'

  export default {
    name: 'Courses',
    components: { List, CourseCard }
  }
</script>

<style scoped>

</style>
