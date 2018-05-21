<template>
  <v-select
    :items="config['items']"
    :label="config['label']"
    v-model="config['value']"
    chips
    tags
    deletable-chips
  ></v-select>
</template>

<script>
  export default {
    name: 'TagSelect',
    props: ['config']
  }
</script>

<style scoped>

</style>
