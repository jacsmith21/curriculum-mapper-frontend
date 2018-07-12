<template>
  <sidebar-base>
    <v-card>

      <v-list three-line v-if="course">
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

        <date v-model="date1" @input="handleDateInput"></date>
        <date v-model="date2" @input="compare"></date>


        <v-spacer></v-spacer>
        <v-btn flat @click="clickedHistory">
          <v-icon right left>history</v-icon>
        </v-btn>
        <v-btn flat to="edit" append>
          <v-icon right left>edit</v-icon>
        </v-btn>
        <v-btn flat @click="deleteCourse">
          <v-icon right left>delete</v-icon>
        </v-btn>
      </v-card-actions>

    </v-card>

    <v-navigation-drawer
      v-model="showHistory"
      clipped
      fixed
      app
      right
    >
      <v-list two-line>
        <v-subheader>Version History</v-subheader>
        <template v-for="(patch, index) in patches">
          <v-list-tile ripple :key="index" class="tile" @click="">

            <v-list-tile-content>
              <v-list-tile-title>{{ opLabelMap[patch.op] }} {{ processKey(patch.path) }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ patch.value || 'None' }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{ patch.time }}</v-list-tile-action-text>
              <v-list-tile-action-text></v-list-tile-action-text>
            </v-list-tile-action>

          </v-list-tile>
          <v-divider v-if="index + 1 < patch.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
  </sidebar-base>
</template>


<script>
  import SidebarBase from '@/views/SidebarBase'
  import router from '@/router'
  import Date from '@/components/inputs/Date'

  export default {
    name: 'CourseCard',
    components: { SidebarBase, Date },
    data () {
      return {
        showHistory: false,
        opLabelMap: {add: 'Added', remove: 'Removed', replace: 'Changed'},
        date1: null,
        date2: null,
        menu: false
      }
    },
    computed: {
      name () {
        return this.$route.params.name
      },
      course: function () {
        return this.$store.getters.courseByName(this.name)
      },
      data () {
        if (this.course === undefined) {
          return []
        }

        let course = null
        if (this.$store.state.course === null) {
          course = this.course
        } else {
          course = this.$store.state.course
        }

        return [
          ['Name', course.name],
          ['Title', course.title],
          ['Description', course.description],
          ['Maintainer', course.maintainer],
          ['Prerequisites', course.prerequisites],
          ['Corequisites', course.corequisites],
          ['Recommended', course.recommended]
        ]
      },
      patches () {
        if (this.course === undefined) {
          return []
        }

        console.log('Computing patches!')
        return this.$store.state.history[this.course._id] || []
      }
    },
    methods: {
      deleteCourse () {
        this.$store.dispatch('deleteCourse', this.course)
      },
      clickedHistory () {
        if (!this.showHistory) {
          this.$store.dispatch('loadHistory', this.course._id)
        }
        this.showHistory = !this.showHistory
      },
      processKey (key) {
        const keys = key.split('/')
        const lastKey = keys[keys.length - 1]
        return this.firstLetterUpper(lastKey)
      },
      firstLetterUpper (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      handleDateInput (date) {
        this.$store.dispatch('loadCourseAtDate', {date: date, _id: this.course._id})
      },
      compare () {
        if (!this.date1 || !this.date2) {
          return
        }

        router.push({name: 'compare', params: {_id: this.course._id, then: this.date1, now: this.date2}})
      }
    },
    mounted () {
      this.$store.commit('setCourse', null)
    }
  }
</script>

<style scoped>

</style>
