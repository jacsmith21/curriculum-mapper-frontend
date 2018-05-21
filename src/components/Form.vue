<template>
  <v-container fluid style="margin: 0">
    <v-layout row wrap>

      <v-flex xs12>
        <v-card>
          <v-card-title primary-title><div class="headline">Courses Form</div></v-card-title>
          <v-card-text>

            <template v-for="(value, key) in form">
              <TextField v-if="!value['type'] || value['type'] === 'text'" :config="value" :identifier="key"></TextField>
              <TagSelect v-else :config="value"></TagSelect>
            </template>

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
  import { mapState } from 'vuex'
  import TextField from '@/components/inputs/TextField'
  import TagSelect from '@/components/inputs/TagSelect'

  // TODO: Fix this. We shouldn't be directly modifying stuff in the store.
  export default {
    name: 'Form',
    components: { TextField, TagSelect },
    data () {
      return {
        items: ['Trigonometry', 'Java', 'Loops', 'Teamwork']
      }
    },
    methods: {
      submit () {
        this.$store.dispatch('addCourse')
      }
    },
    computed: mapState(['form'])
  }
</script>

<style scoped>

</style>
