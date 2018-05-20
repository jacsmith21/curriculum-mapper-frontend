<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>
          <v-card-title class="headline" primary-title>Courses Information</v-card-title>

          <v-list two-line>
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>school</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ this.course.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ this.course.instructor }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>info</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ this.course.description }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat>Edit
              <v-icon right>edit</v-icon>
            </v-btn>
            <v-btn flat>Delete
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
    computed: {
      course () {
        return this.$store.getters.getCourse(this.$route.params.instructor, this.$route.params.name)
      }
    }
  }
</script>

<style scoped>

</style>
