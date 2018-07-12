<template>
  <sidebar-base>
    <v-container grid-list-md text-xs-center style="padding: 0">
      <v-layout row wrap>
        <v-flex xs6>
          <course-card :course="courseThen"></course-card>
        </v-flex>
        <v-flex xs6>
          <course-card :course="courseNow" :tile-style="tileStyle"></course-card>
        </v-flex>
      </v-layout>
    </v-container>
  </sidebar-base>
</template>

<script>
  import * as jsonpatch from 'fast-json-patch'
  import SidebarBase from '@/views/SidebarBase'
  import CourseCard from '@/components/CourseCard'

  export default {
    name: 'Compare',
    components: { CourseCard, SidebarBase },
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
        return this.$store.getters.courseByName(this.name) || {}
      },
      _id () {
        return this.course._id
      },
      states () {
        return this.$store.state.courseStates[this._id] || {}
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
      }
    },
    mounted () {
      this.$store.dispatch('loadCourseAtDate', {_id: this._id, date: this.then})
      this.$store.dispatch('loadCourseAtDate', {_id: this._id, date: this.now})
    }
  }
</script>
