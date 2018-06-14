<template>
  <v-layout>
    <List width="400"></List>
    <StrandForm></StrandForm>
  </v-layout>
</template>

<script>
  import StrandForm from '@/components/StrandForm.vue'
  import List from '@/components/CourseList.vue'

  export default {
    name: 'Strand',
    components: { StrandForm, List }
  }
</script>
