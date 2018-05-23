<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>
          <v-card-title class="headline" primary-title>Courses Information</v-card-title>

          <!--v-if there to remove undefined error. There is definitely a better way to do this.-->
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
              identifier="instructor"
              dispatch="editCourse"
            ></EditableTile>

            <v-divider inset></v-divider>
            <EditableTile
              icon="info"
              :instance="course"
              identifier="description"
              dispatch="editCourse"
            ></EditableTile>

            <v-divider inset></v-divider>
            <EditableTile
              icon="code"
              :instance="course"
              identifier="learningOutcomes"
              :label="course.learningOutcomes.join(', ')"
              dispatch="editCourse"
            ></EditableTile>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>navigate_before</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  <router-link v-for="prerequisite in prerequisites" :to="'/courses/' + prerequisite">{{ prerequisite }}</router-link>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

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
</template>


<script>
  import EditableTile from '@/components/inputs/EditableTile'

  export default {
    name: 'CourseCard',
    components: { EditableTile },
    data () {
      return {
        edit: false,
        snackbar: false
      }
    },
    computed: {
      course: function () {
        return this.$store.getters.courseByName(this.$route.params.name)
      },
      prerequisites () {
        return this.course.prerequisites.map(prerequisite => this.$store.getters.courseById(prerequisite).name)
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
