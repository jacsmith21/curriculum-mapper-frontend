<template>
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
</template>

<script>
  export default {
    props: {title: String, submit: Function, submitText: {type: String, default: 'Submit'}}
  }
</script>

<style scoped>

</style>
