<template>
  <sidebar-base>
    <j-drawer :items="items"></j-drawer>
    <j-card :compute-items="computeBenchmarkItems" :item="benchmark" object="benchmarks" actions></j-card>
  </sidebar-base>
</template>

<script>
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'
  import JDrawer from '@/components/JDrawer'
  import { computeBenchmarkItems } from '@/_'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'Benchmark',
    components: {JCard, SidebarBase, JDrawer},
    computed: {
      benchmark: function () {
        return this.benchmarkNameLookup[this.name] || this.firstBenchmark
      },
      name () {
        return this.$route.params.name
      },
      firstBenchmark () {
        if (this.benchmarks.length) {
          // noinspection JSPotentiallyInvalidTargetOfIndexedPropertyAccess
          return this.benchmarks[0]
        } else {
          return {}
        }
      },
      items () {
        return this.benchmarks.map(benchmark =>
          ({title: benchmark.name, headline: benchmark.accreditor || 'No Accreditor', to: `/benchmarks/${benchmark.name}`}))
      },
      ...mapGetters(['benchmarkNameLookup']),
      ...mapState(['benchmarks'])
    },
    methods: {computeBenchmarkItems},
    mounted () {
      this.$store.dispatch('loadItems', 'benchmarks')
    }
  }
</script>
