<template>
  <v-card>

    <v-card-title
      primary-title
      class="j-flex-center">
      <div class="headline" style="font-size: 35px!important;">{{ title }}</div>
    </v-card-title>

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
      <v-btn v-if="cancelText" flat @click="cancel">{{ cancelText }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat @click="submit">{{ submitText }}</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
  export default {
    name: 'JCardForm',
    props: {
      title: String,
      submit: {type: Function, required: true},
      cancel: Function,
      submitText: {type: String, default: 'Submit'},
      cancelText: String
    }
  }
</script>

<style scoped>

</style>
