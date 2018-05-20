<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>
          <v-card-title primary-title><div class="headline">{{ this.course.name }}</div></v-card-title>
          <v-card-text>


          </v-card-text>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions>
            <v-btn flat>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat>Submit</v-btn>
          </v-card-actions>

          <p>Instructor: {{ instructor  }} is the best</p>
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
        instructor: this.$route.params.instructor,
        name: this.$route.params.name
      }
    },
    computed: {
      course () {
        return this.$store.getters.getCourse(this.instructor, this.name)
      }
    }
  }
</script>

<style scoped>

</style>
