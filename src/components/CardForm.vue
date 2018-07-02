<template>
  <v-container fluid :style="style">
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>

          <v-card-title primary-title style="padding-left: 35px"><div class="headline">{{ title }}</div></v-card-title>

          <v-card-text>
            <v-form>
              <v-container grid-list-xl fluid>
                <v-layout wrap>
                  <slot></slot>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>

          <v-divider class="mt-5"></v-divider>
          <v-card-actions>
            <v-btn flat>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="submit">{{ submitText }}</v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>

    <v-snackbar bottom left :timeout="timeout" v-model="snackbar">
      {{ snackbarText }}
      <v-btn flat icon @click="snackbar = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>

  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        snackbar: false,
        timeout: 6000,
        style: {margin: 0, overflow: 'auto'}
      }
    },
    props: {title: String, submit: Function, snackbarText: String, submitText: {type: String, default: 'Submit'}}
  }
</script>

<style scoped>

</style>
