<template>
  <sidebar-base>
    <v-container fluid style="margin: 0">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title class="headline" primary-title>Courses Information</v-card-title>

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
        </v-flex>
      </v-layout>
    </v-container>

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
          <v-list-tile ripple :key="index" class="tile">
            <v-list-tile-content>
              <v-list-tile-title>{{ patch.op }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ patch.path }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ patch.value }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < patch.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
  </sidebar-base>
</template>


<script>
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'CourseCard',
    components: { SidebarBase },
    data () {
      return {
        showHistory: false
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

        return [
          ['Name', this.course.name],
          ['Title', this.course.title],
          ['Description', this.course.description],
          ['Maintainer', this.course.maintainer],
          ['Prerequisites', this.course.prerequisites],
          ['Corequisites', this.course.corequisites],
          ['Recommended', this.course.recommended]
        ]
      },
      patches () {
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
      }
    }
  }
</script>

<style scoped>

</style>
