<template>
  <v-layout>

    <v-layout style="max-width: 400px; min-width: 400px">
      <div style="position: relative; width: 100%">
        <VueAutoVirtualScrollList class="list" :totalHeight="height" :defaultHeight="80">
          <template v-for="(item, index) in items">
            <v-list-tile
              :key="index"
              avatar
              ripple
              @click="toggle(index)"
              class="item"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </VueAutoVirtualScrollList>
        <Loading class="list-loading" :loading="loading"></Loading>
      </div>
    </v-layout>

    <v-container fluid style="margin: 0">
      <v-layout row wrap>

        <v-flex xs12>
          <v-card ref="form">
            <v-card-title primary-title><div class="headline">Course Form</div></v-card-title>
            <v-card-text>

              <template v-for="(value, key) in form">
                  <v-text-field
                    :value="value"
                    :label="key"
                    v-model="form[key]"
                  ></v-text-field>
              </template>

              <p>Message is: {{ form['name'] }}</p>
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

  </v-layout>
</template>

<script>
  import Loading from '@/components/Loading.vue'
  import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'
  import 'vuetify/src/stylus/components/_lists.styl'

  const getList = (length) => {
    let array = []
    for (let i = 0; i < length; i++) {
      array.push({
        headline: 'Dr. MacIsaac',
        title: 'CS10' + i,
        subtitle: 'This is the ' + i + 'th index!'
      })
    }
    array.push({
      headline: 'Add a Course',
      title: 'Add a Course',
      subtitle: 'None'
    })
    return array
  }

  export default {
    name: 'Test',
    components: { VueAutoVirtualScrollList, Loading },
    data () {
      return {
        loading: false,
        items: getList(8),
        form: {'name': '', 'number': '', 'instructor': '', 'description': ''}
      }
    },
    computed: {
      height: function () {
        return window.innerHeight - 64 - 32  // Take off size of toolbar & footer
      }
    },
    methods: {
      toggle: function (index) {
        console.log('Toggle: ' + index)
      },
      submit: function () {
        console.log('Submitted!')

        this.items.push({
          headline: this.form['instructor'],
          title: this.form['name'],
          subtitle: this.form['description']
        })
      }
    }
  }
</script>

<style>
  .list-loading {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .item {
    border-bottom: 1px solid #eee;
  }

  /*This is to size of the items!*/
  /*noinspection CssUnusedSymbol*/
  .list__tile--avatar {
    height: 80px!important;
  }
</style>
