<template>
  <v-flex xs12 class="top">
    <!--<h2>{{ title }}</h2>-->
    <component :is="tag">{{ title }}</component>
    <!--<v-divider></v-divider>-->
  </v-flex>
</template>

<script>
  export default {
    name: 'JFormBreak',
    props: {title: String, tag: {type: String, default: 'h2'}}
  }
</script>

<style scoped>
  h2 {
    font-weight: 400;
    font-size: 1.7rem;
    margin-bottom: 5px;
    color: rgba(0, 0, 0, 0.80);
  }

  h3 {
    font-size: 1.3rem;
  }

  .top {
    padding-top: 15px;
    padding-bottom: 0
  }

  h1, h2, h3, h4 {
    margin: 0 0 16px;
    font-family: "Proxima Nova",proxima-nova,"Helvetica Neue",Helvetica,Arial,sans-serif;
    color: #222;
    text-transform: none;
  }
</style>
