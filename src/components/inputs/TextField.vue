<template>
  <v-text-field
    :value="config['value']"
    :label="config['label']"
    v-model="config['value']"
  ></v-text-field>
</template>

<script>
  export default {
    name: 'TextField',
    props: ['config']
  }
</script>

<style scoped>

</style>
