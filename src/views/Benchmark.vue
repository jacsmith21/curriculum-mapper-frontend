<template>
  <sidebar-base>
    <j-card :compute-items="items" :item="benchmark" object="benchmarks"></j-card>
  </sidebar-base>
</template>

<script>
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'

  export default {
    name: 'Benchmark',
    components: {JCard, SidebarBase},
    computed: {
      benchmark: function () {
        return this.$store.getters.benchmarkNameLookup[this.name] || {}
      },
      name () {
        return this.$route.params.name
      }
    },
    methods: {
      items (benchmark) {
        return [['Name', benchmark.name], ['Accreditor', benchmark.accreditor]]
      }
    }
  }
</script>
