<template>
  <sidebar-base>
    <j-drawer :items="items"></j-drawer>
    <j-card :item="course" actions :compute-items="computeCourseItems" object="courses">
      <!--<vue-markdown :source="markdown" class="markdown"></vue-markdown>-->
      <v-container grid-list-lg>
        <v-layout wrap>

          <v-flex xs12>
            <h1>
              {{ course.number }}: {{ course.title }}
            </h1>
          </v-flex>
          <v-flex xs12>
            <p>
              {{ course.description || 'No Description' }}
            </p>
          </v-flex>

          <v-flex xs12>
            <h2>Requisites</h2>
          </v-flex>
          <v-flex xs4>
            <h3>Prerequisites</h3>
          </v-flex>
          <v-flex xs4>
            <h3>Corequisites</h3>
          </v-flex>
          <v-flex xs4>
            <h3>Recommended</h3>
          </v-flex>
          <v-flex xs4>
            <p>{{ course.prerequisites || 'No Prerequisites' }}</p>
          </v-flex>
          <v-flex xs4>
            <p>{{ course.corequisites || 'No Corequisites' }}</p>
          </v-flex>
          <v-flex xs4>
            <p>{{ course.recommended || 'No Recommended' }}</p>
          </v-flex>

          <v-flex xs12>
            <h2>Sections</h2>
          </v-flex>
          <v-flex xs4 v-if="hasSections">
            <h3>Instructor</h3>
          </v-flex>
          <v-flex xs4 v-if="hasSections">
            <h3>Section</h3>
          </v-flex>
          <v-flex xs4 v-if="hasSections">
            <h3>Section Count</h3>
          </v-flex>
          <template v-for="section in course.sections">
            <v-flex>
              <p>{{ section.instructor }}</p>
            </v-flex>
            <v-flex xs4>
              <p>{{ section.section }}</p>
            </v-flex>
            <v-flex xs4>
              <p>{{ section.count }}</p>
            </v-flex>
          </template>
          <v-flex xs12 v-if="!hasSections">
            <p>None</p>
          </v-flex>

          <v-flex xs12><h2>Maintainer</h2></v-flex>
          <v-flex xs12><p>{{ course.maintainer || 'None' }}</p></v-flex>
        </v-layout>
      </v-container>
    </j-card>
  </sidebar-base>
</template>


<script>
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'
  import { computeCourseItems, COURSE } from '@/_'
  import JDrawer from '@/components/JDrawer'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'Course',
    components: {JDrawer, JCard, SidebarBase},
    computed: {
      number () {
        return this.$route.params.name
      },
      course () {
        return this.courseNumberLookup[this.number] || this.firstCourse
      },
      firstCourse () {
        if (this.courses.length) {
          // noinspection JSPotentiallyInvalidTargetOfIndexedPropertyAccess
          return this.courses[0]
        } else {
          return {}
        }
      },
      hasSections () {
        return !!this.course.sections
      },
      items () {
        return this.courses.map(course =>
          ({title: course.number, headline: course.title || 'No Title', to: `/courses/${course.number}`}))
      },
      ...mapGetters(['courseNumberLookup']),
      ...mapState([COURSE])

    },
    methods: {computeCourseItems}
  }
</script>

<style>
  h1 {
    font-size: 1.7em;
  }
</style>
