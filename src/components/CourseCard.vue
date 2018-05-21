<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>
          <v-card-title class="headline" primary-title>Courses Information</v-card-title>

          <!--v-if there to remove undefined error. There is definitely a better way to do this.-->
          <v-list two-line v-if="course">

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>school</v-icon>
              </v-list-tile-action>
              <input ref="input" v-show="edit === true" v-on:blur="edit = false" @keyup.enter="edit = false" v-model="course.name">
              <v-list-tile-content @dblclick="doubleClick" v-show="edit === false">
                <v-list-tile-title>{{ course.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ course.instructor }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>info</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ course.description }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile @dblclick="doubleClick">
              <v-list-tile-action>
                <v-icon>code</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ course.learningOutcomes.join(', ') }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat>Edit
              <v-icon right>edit</v-icon>
            </v-btn>
            <v-btn flat @click="deleteCourse">Delete
              <v-icon right>delete</v-icon>
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>
  export default {
    name: 'CourseCard',
    data () {
      return {
        edit: false
      }
    },
    computed: {
      course: function () {
        return this.$store.getters.getCourse(this.$route.params.instructor, this.$route.params.name)
      }
    },
    methods: {
      deleteCourse () {
        this.$store.dispatch('deleteCourse', this.course)
      },
      doubleClick () {
        console.log(this.$refs.input)
        this.edit = true
        this.$nextTick(() => this.$refs.input.focus())
      }
    }
  }
</script>

<style scoped>

</style>
