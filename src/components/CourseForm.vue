<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>

          <v-card-title primary-title><div class="headline">Courses Form</div></v-card-title>

          <v-card-text>
            <v-form>
              <TextField label="Name" identifier="name"></TextField>
              <TextField label="Instructor" identifier="instructor"></TextField>
              <TextField label="Description" identifier="description"></TextField>
              <TagSelect label="Learning Outcomes" identifier="learningOutcomes" :items="items"></TagSelect>
              <TagSelect label="Prerequisites" identifier="prerequisites" :items="courseItems"></TagSelect>
            </v-form>
          </v-card-text>

          <v-divider class="mt-5"></v-divider>
          <v-card-actions>
            <v-btn flat>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="submit">Submit</v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>

    </v-layout>

    <v-snackbar :bottom="true" :left="true" :timeout="6000" v-model="snackbar">
      Course added!
      <v-btn flat icon @click="snackbar = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>

  </v-container>
</template>

<script>
  import TextField from '@/components/inputs/TextField'
  import TagSelect from '@/components/inputs/TagSelect'

  export default {
    name: 'CourseForm',
    components: { TagSelect, TextField },
    data () {
      return {
        items: ['Trigonometry', 'Java', 'Loops', 'Teamwork'],
        snackbar: false,
        defaultInput: TextField
      }
    },
    computed: {
      courseItems () {
        return this.$store.state.courses.map(course => course.name)
      }
    },
    methods: {
      submit () {
        this.$store.dispatch('addCourse')
        this.snackbar = true
      }
    }
  }
</script>
