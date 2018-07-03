<template>
  <sidebar-base>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title class="headline" primary-title>Courses Information</v-card-title>

          <!--v-if exists to remove undefined error. There may be a better way to do this!-->
          <v-list three-line v-if="course">
            <template v-for="(item, index) in this.data">
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
  </sidebar-base>
</template>


<script>
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'CourseCard',
    components: { SidebarBase },
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
      }
    },
    methods: {
      deleteCourse () {
        this.$store.dispatch('deleteCourse', this.course)
      }
    }
  }
</script>

<style scoped>

</style>
