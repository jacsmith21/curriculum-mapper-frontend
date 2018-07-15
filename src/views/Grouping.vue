<template>
  <j-graph :loaded="loaded" :links="links" :nodes="nodes" @render="renderGroups">

  </j-graph>
</template>

<script>
  import JGraph from '@/components/JGraph'
  import miserable from '@/miserable'

  export default {
    name: 'Grouping',
    components: {JGraph},
    methods: {
      renderGroups () {
        console.log('Rendering!!')
      }
    },
    computed: {
      links () {
        return miserable.links
      },
      nodes () {
        return miserable.nodes
      },
      loaded () {
        return !this._.isEmpty(this.nodes) && !this._.isEmpty(this.links)
      }
    }
  }
</script>

<style scoped>

</style>
