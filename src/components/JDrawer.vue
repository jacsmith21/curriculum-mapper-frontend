<template>
  <v-navigation-drawer v-model="open" :clipped="clipped" fixed app :mobile-break-point="mobileBreakPoint">
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
  import { mapFields } from 'vuex-map-fields'
  import { mapState } from 'vuex'

  export default {
    name: 'JDrawer',
    props: {items: {type: Array, default: []}},
    data () {
      return {
        focused: false,
        filter: '',
        mobileBreakPoint: 1264
      }
    },
    computed: {
      filteredItems () {
        return this.items.filter(this.filterFunction)
      },
      searchTerm () {
        return this.filter.toLowerCase()
      },
      clipped () {
        return !this.mobile
      },
      mobile () {
        return this.width < this.mobileBreakPoint
      },
      ...mapFields(['open']),
      ...mapState(['width'])
    },
    methods: {
      filterFunction (item) {
        return item.title.toLowerCase().startsWith(this.searchTerm)
      }
    },
    watch: {
      mobile: {
        immediate: true,
        handler () {
          // ensure sure drawer is initially closed if we start mobile
          if (this.mobile) {
            // noinspection JSUnusedGlobalSymbols
            this.open = false
          }
        }
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
