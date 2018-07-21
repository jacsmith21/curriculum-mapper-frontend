<template>
  <v-container class="form-container">

    <h1>{{ title }}</h1>

    <v-form>
      <v-container grid-list-lg style="padding-top: 0">
        <slot></slot>
      </v-container>
    </v-form>

    <v-divider class="mt-3"></v-divider>
    <v-card-actions>
      <v-btn v-if="cancelText" flat @click="cancel">{{ cancelText }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat @click="submit">{{ submitText }}</v-btn>
    </v-card-actions>

  </v-container>
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
  h1 {
    font-weight: 300;
    font-size: 2.4rem;
    -moz-osx-font-smoothing: inherit;
    margin-bottom: 1.5rem;
    padding-left: 16px;
  }

  .form-container {
    max-width: 850px;
  }
</style>
