<template>
  <sidebar-base>
    <v-container grid-list-md text-xs-center style="padding: 0">
      <v-layout row wrap>
        <v-flex xs6>
          <j-card :item="courseThen" :compute-items="computeCourseItems"></j-card>
        </v-flex>
        <v-flex xs6>
          <j-card :item="courseNow" :compute-items="computeCourseItems"></j-card>
        </v-flex>
      </v-layout>
    </v-container>
  </sidebar-base>
</template>

<script>
  import * as jsonpatch from 'fast-json-patch'
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'
  import { computeCourseItems } from '@/_'

export default {
    name: 'Compare',
    components: { JCard, SidebarBase },
    data () {
      return {
        colorLookup: {
          'add': '#ceffd2',
          'remove': '#ffc4c7',
          'replace': '#719cff85'
        }
      }
    },
    computed: {
      name () {
        return this.$route.params.name
      },
      then () {
        return this.$route.params.then
      },
      now () {
        return this.$route.params.now
      },
      course () {
        return this.$store.getters.courseNameLookup[this.name] || {}
      },
      _id () {
        return this.course._id
      },
      states () {
        return this.$store.state.objectStates[this._id] || {}
      },
      courseThen () {
        return this.states[this.then] || {}
      },
      courseNow () {
        return this.states[this.now] || {}
      },
      differences () {
        let operations = jsonpatch.compare(this.courseThen, this.courseNow)
        return operations.reduce((differences, operation) => {
          differences[operation.path.slice(1)] = operation.op
          return differences
        }, {})
      }
    },
    methods: {
      tileStyle (key) {
        return {
          backgroundColor: this.colorLookup[this.differences[key]]
        }
      },
      computeCourseItems
    },
    mounted () {
      this.$store.dispatch('loadCourseAtDate', {_id: this._id, date: this.then})
      this.$store.dispatch('loadCourseAtDate', {_id: this._id, date: this.now})
    }
  }
</script>
