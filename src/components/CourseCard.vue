<template>
  <sidebar-base>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>
          <v-card-title class="headline" primary-title>Courses Information</v-card-title>

          <!--v-if exists to remove undefined error. There may be a better way to do this!-->
          <v-list two-line v-if="course">
            <EditableTile
              icon="school"
              :instance="course"
              identifier="name"
              dispatch="editCourse"
            ></EditableTile>

            <v-divider inset></v-divider>
            <EditableTile
              icon="person"
              :instance="course"
              identifier="maintainer"
              dispatch="editCourse"
            ></EditableTile>

            <v-divider inset></v-divider>
            <editable-tile
              icon="info"
              :instance="course"
              identifier="description"
              dispatch="editCourse"
            ></editable-tile>

            <v-divider inset></v-divider>
            <EditableTile
              icon="code"
              :instance="course"
              identifier="learningOutcomes"
              :label="course.learningOutcomes && course.learningOutcomes.join(', ')"
              dispatch="editCourse"
            ></EditableTile>

            <v-divider inset></v-divider>
            <EditableTile
              icon="navigate_before"
              :instance="course"
              identifier="prerequisites"
              :label="course.prerequisites"
              dispatch="editCourse"
            ></EditableTile>

          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="deleteCourse">
              <v-icon right left>delete</v-icon>
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>

    </v-layout>

    <v-snackbar :bottom="true" :left="true" :timeout="6000" v-model="snackbar">
      Course modified!
      <v-btn flat icon @click="snackbar = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>

  </v-container>
  </sidebar-base>
</template>


<script>
  import EditableTile from '@/components/inputs/EditableTile'
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'CourseCard',
    components: { EditableTile, SidebarBase },
    data () {
      return {
        edit: false,
        snackbar: false
      }
    },
    computed: {
      course: function () {
        return this.$store.getters.courseByName(this.$route.params.name)
      }
    },
    methods: {
      deleteCourse () {
        this.$store.dispatch('deleteCourse', this.course)
        this.snackbar = true
      }
    }
  }
</script>

<style scoped>

</style>
