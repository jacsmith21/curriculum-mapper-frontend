<template>
  <v-navigation-drawer :v-model="open" clipped fixed app>
    <v-list two-line>
      <v-list-tile>
        <v-text-field
          label="Filter"
          :flat="!focused"
          prepend-inner-icon="search"
          solo
          v-model="filter"
          @focus="focused = true"
          @blur="focused = false"
        ></v-text-field>
      </v-list-tile>
      <template v-for="item in filteredItems">
        <v-divider></v-divider>
        <v-list-tile ripple :key="item.title" :to="item.to" class="tile">

          <v-list-tile-content>
            <v-list-tile-title class="title">{{ item.title }}</v-list-tile-title>
            <v-list-tile-sub-title class="text--primary sub-title">{{ item.headline }}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'JDrawer',
    props: {items: {type: Array, default: []}},
    data () {
      return {
        focused: false,
        open: true,
        filter: ''
      }
    },
    computed: {
      filteredItems () {
        return this.items.filter(this.filterFunction)
      },
      searchTerm () {
        return this.filter.toLowerCase()
      }
    },
    methods: {
      filterFunction (item) {
        return item.title.toLowerCase().startsWith(this.searchTerm)
      }
    }
  }
</script>

<style scoped>
  .title {
    font-weight: 400!important;
    font-size: 16px!important;
  }

  .sub-title {
    color: rgba(0, 0, 0, .65);
    font-weight: 400!important;
  }
</style>
