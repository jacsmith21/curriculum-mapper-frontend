<template>
  <v-select
    :items="items"
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
    props: ['config'],
    computed: {
      items () {
        if (typeof this.config === 'string') {
          return
        }
        return this.config.items
      }
    }
  }
</script>

<style scoped>

</style>
