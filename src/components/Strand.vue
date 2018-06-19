<template>
  <v-layout>
    <StrandForm></StrandForm>
  </v-layout>
</template>

<script>
  import StrandForm from '@/components/StrandForm.vue'

  export default {
    name: 'Strand',
    components: { StrandForm },
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        title: 'Visualization'
      }
    }
  }
</script>
