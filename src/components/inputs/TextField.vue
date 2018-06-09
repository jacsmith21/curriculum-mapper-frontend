<template>
  <v-flex xs12>
    <v-text-field
      :label="label"
      v-model="model"
    ></v-text-field>
  </v-flex>
</template>

<script>
  export default {
    name: 'TextField',
    props: ['model', 'label']
  }
</script>

