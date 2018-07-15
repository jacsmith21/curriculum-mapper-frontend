<template>
  <v-container fluid style="margin: 0; overflow: auto">
    <v-layout row wrap>
      <v-flex xs12>
        <slot></slot>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'SidebarBase'
  }
</script>
