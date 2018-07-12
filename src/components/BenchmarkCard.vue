<template>
  <SidebarBase>
    <v-card>

      <v-list three-line>
        <template v-for="(item, index) in data">
          <v-divider v-if="index !== 0"></v-divider>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ item[0] }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item[1] || 'None' }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>

      <v-card-actions>

        <v-spacer></v-spacer>
        <v-btn flat @click="">
          <v-icon right left>history</v-icon>
        </v-btn>
        <v-btn flat append>
          <v-icon right left>edit</v-icon>
        </v-btn>
        <v-btn flat @click="">
          <v-icon right left>delete</v-icon>
        </v-btn>
      </v-card-actions>

    </v-card>
  </SidebarBase>
</template>

<script>
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'BenchmarkCard',
    components: {SidebarBase},
    computed: {
      benchmark: function () {
        return this.$store.state.benchmarks.filter(benchmark => benchmark.name === this.name)[0]
      },
      data () {
        if (this.benchmark === undefined) {
          return []
        }

        return [['Name', this.benchmark.name]]
      },
      name () {
        return this.$route.params.name
      }
    }
  }
</script>

<style scoped>

</style>
