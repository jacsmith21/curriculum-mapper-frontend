<template>
  <sidebar-base>
    <j-card :compute-items="computeBenchmarkItems" :item="benchmark" object="benchmarks" actions></j-card>
  </sidebar-base>
</template>

<script>
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'
  import { computeBenchmarkItems } from '@/_'

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
      computeBenchmarkItems
    }
  }
</script>
