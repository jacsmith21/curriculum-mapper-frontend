<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>
          <v-card-title primary-title><div class="headline">Courses Form</div></v-card-title>
          <v-card-text>

            <template v-for="(value, key) in form">
              <v-text-field
                :value="value"
                :label="key"
                v-model="form[key]"
              ></v-text-field>
            </template>

            <v-select
              :items="items"
              label="Learning Outcomes"
              chips
              tags
              deletable-chips
            ></v-select>

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
  </v-container>
</template>

<script>
  export default {
    name: 'Form',
    props: ['form'],
    data () {
      return {
        items: ['Trigonometry', 'Java', 'Loops', 'Teamwork']
      }
    },
    methods: {
      submit () {
        this.$store.commit('addCourse', this.form)
      }
    }
  }
</script>

<style scoped>

</style>
