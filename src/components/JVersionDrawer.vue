<template>
  <v-navigation-drawer :value="content" @input="input" clipped fixed app right>
    <v-tabs v-model="active" grow>
      <v-tab ripple>Major</v-tab>
      <v-tab ripple>All</v-tab>
    </v-tabs>

    <v-list two-line>
      <template v-for="(item, index) in processedRevisions">
        <v-list-tile ripple :key="index" class="tile" @click="">

          <v-list-tile-content v-if="item.isOperation">
            <v-list-tile-title>{{ opLabelMap[item.op] }} {{ processKey(item.path) }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.value || 'None' }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-content v-else>
            <v-list-tile-title>{{ firstLetterUpper(item.type) }} Revision</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.operations.length }} Operations by {{ item.initials || 'Anonymous' }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text>{{ item.date }}</v-list-tile-action-text>
            <v-btn icon @click="expand(item.index)" v-if="!item.isOperation">
              <v-icon v-if="expanded.includes(item.index)">expand_less</v-icon>
              <v-icon v-else>expand_more</v-icon>
            </v-btn>
          </v-list-tile-action>

        </v-list-tile>
        <v-divider v-if="processedRevisions[index + 1] && !processedRevisions[index + 1].isOperation"></v-divider>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { vmodel } from '@/mixins'

  export default {
    name: 'JVersionDrawer',
    props: {revisions: {type: Array, required: true}},
    mixins: [vmodel],
    data () {
      return {
        active: 0,
        expanded: [],
        opLabelMap: {add: 'Added', remove: 'Removed', replace: 'Changed'},
        options: {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      }
    },
    computed: {
      majorTabOpen () {
        return this.active === 0
      },
      processedRevisions () {
        let items
        if (this.majorTabOpen) {
          items = this.majorRevisions
        } else {
          items = this.revisions
        }

        items = items.slice(0)  // create a shallow copy
        items = items.map((item, i) => ({...item, index: i}))

        let indices = this.expanded.slice(0)
        indices.sort()
        indices.reverse().map(index => {
          items[index].operations.map(operation => {
            items.splice(index + 1, 0, operation)
          })
        })
        return items.map(item => ({...item, isOperation: !!item.op, date: new Date(item.time * 1000).toLocaleString('en-US', this.options)}))
      },
      majorRevisions () {
        return this.revisions.filter(revision => revision.type === 'major')
      }
    },
    methods: {
      processKey (key) {
        if (!key) {
          return key
        }

        const keys = key.split('/').filter(k => k)
        return keys.join(' ')
      },
      firstLetterUpper (string) {
        // noinspection JSUnresolvedFunction
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      expand (index) {
        if (this.expanded.includes(index)) {
          this.expanded = this.expanded.filter(i => i !== index)
        } else {
          this.expanded.push(index)
        }
      }
    },
    watch: {
      revisions () {
        this.expanded = []
      }
    }
  }
</script>

<style scoped>

</style>
