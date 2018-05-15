<template>
  <v-container fluid>
    <v-layout
      column
      v-scroll:#scroll-target="onScroll"
    >
      <v-list
        two-line
        id="scroll-target"
        style="max-height: 100%"
        class="scroll-y">

        <template v-for="(item, index) in items">
          <v-list-tile
            :key="item.title"
            avatar
            ripple
            @click="open(index)"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          action: '15 min',
          headline: 'Dr. MacIsaac',
          title: 'CS1013',
          subtitle: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        {
          action: '2 hr',
          headline: 'Dr. MacIsaac',
          title: 'CS1073',
          subtitle: "Wish I could come, but I'm out of town this weekend."
        },
        {
          action: '6 hr',
          headline: 'Dr. MacIsaac',
          title: 'CS1083',
          subtitle: 'Do you have Paris recommendations? Have you ever been?'
        },
        {
          action: '12 hr',
          headline: 'Dr. MacIsaac',
          title: 'CS2043',
          subtitle: 'Have any ideas about what we should get Heidi for her birthday?'
        },
        {
          action: '18hr',
          headline: 'Dr. MacIsaac',
          title: 'CS1303',
          subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.'
        }
      ],
      offsetTop: 0
    }
  },
  methods: {
    open (index) {
      console.log('Opening ' + index)
    },
    onScroll (e) {
      this.offsetTop = e.target.scrollTop
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#list {
  max-width: 350px;
}
</style>
