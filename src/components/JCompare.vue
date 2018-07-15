<template>
  <sidebar-base>
    <v-container grid-list-md text-xs-center style="padding: 0">
      <v-layout row wrap>
        <v-flex xs6>
          <j-card :object="object" :item="itemOne" :compute-items="computeItems" date :date-change="handleThis"></j-card>
        </v-flex>
        <v-flex xs6>
          <j-card :object="object" :item="itemTwo" :compute-items="computeItems" date :date-change="handleThat" :tile-style="tileStyle"></j-card>
        </v-flex>
      </v-layout>
    </v-container>
  </sidebar-base>
</template>

<script>
  import * as jsonpatch from 'fast-json-patch'
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'

  export default {
    name: 'JCompare',
    props: {
      object: {type: String, require: true},
      computeItems: {type: Function, required: true},
      item: {type: Object, required: true}
    },
    components: { JCard, SidebarBase },
    data () {
      return {
        colorLookup: {
          'add': '#ceffd2',
          'remove': '#ffc4c7',
          'replace': '#719cff85'
        },
        this: null,
        that: null
      }
    },
    computed: {
      name () {
        return this.$route.params.name
      },
      _id () {
        return this.item._id
      },
      states () {
        return this.$store.state.states[this._id] || {}
      },
      itemOne () {
        return {
          ...(this.states[this.this] || {}),
          _id: this._id
        }
      },
      itemTwo () {
        return {
          ...(this.states[this.that] || {}),
          _id: this._id
        }
      },
      differences () {
        let operations = jsonpatch.compare(this.itemOne, this.itemTwo)
        return operations.reduce((differences, operation) => {
          differences[operation.path.slice(1)] = operation.op  // slice(1) to remove leading forward slash
          return differences
        }, {})
      }
    },
    methods: {
      tileStyle (key) {
        console.log(key, this.colorLookup[this.differences[key]])
        return {
          backgroundColor: this.colorLookup[this.differences[key]]
        }
      },
      handleThis (date) {
        this.this = date
      },
      handleThat (date) {
        this.that = date
      }
    }
  }
</script>
