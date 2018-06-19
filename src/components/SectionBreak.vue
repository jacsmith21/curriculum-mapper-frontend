<template>
  <v-flex xs12 style="padding-top: 0; padding-bottom: 0">
    <h3 class="headline" style="font-size: 20px!important; margin-bottom: 5px; color: rgba(0, 0, 0, 0.80);">{{ title }}</h3>
    <v-divider></v-divider>
  </v-flex>
</template>

<script>
  export default {
    name: 'SectionBreak',
    props: ['title']
  }
</script>
