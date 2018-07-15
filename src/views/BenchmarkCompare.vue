<template>
  <j-compare object="benchmarks" :compute-items="computeBenchmarkItems" :item="benchmark"></j-compare>
</template>

<script>
  import JCompare from '@/components/JCompare'
  import { computeBenchmarkItems } from '@/_'

  export default {
    name: 'BenchmarkCompare',
    components: {JCompare},
    computed: {
      benchmark: function () {
        return this.$store.getters.benchmarkNameLookup[this.name] || {}
      },
      name () {
        return this.$route.params.name
      }
    },
    methods: { computeBenchmarkItems }
  }
</script>
