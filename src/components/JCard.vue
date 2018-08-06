<template>
  <v-container>

    <v-card>
      <v-list three-line>
        <slot>
          <template v-for="(item, index) in items">
            <v-divider v-if="index !== 0"></v-divider>
            <v-list-tile :style="tileStyle(item[1])">
              <v-list-tile-content>
                <v-list-tile-title>{{ item[0] }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item[2] || 'None' }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </slot>
      </v-list>

      <v-card-actions v-show="actions || date">
        <j-date-picker v-model="dateText" v-if="date"></j-date-picker>
        <v-spacer></v-spacer>
        <v-btn v-for="button in buttons" v-if="button.show" flat @click="button.handle" v-show="actions" :key="button.icon">
          <v-icon right left>{{ button.icon }}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <j-version-drawer v-model="showHistory" :revisions="revisions"></j-version-drawer>

  </v-container>
</template>

<script>
  import { router } from '@/router'
  import JVersionDrawer from '@/components/JVersionDrawer'
  import JDatePicker from '@/components/inputs/JDatePicker'
  import {COURSE} from '@/_'

  export default {
    name: 'JCard',
    components: {JVersionDrawer, JDatePicker},
    props: {
      computeItems: {required: true, type: Function},
      item: {required: true, type: Object},
      object: String,
      actions: {type: Boolean, default: false},
      date: {type: Boolean, default: false},
      tileStyle: {type: Function, default: () => {}},
      timeChange: {type: Function, default: () => {}},
      edit: {type: Boolean, default: false},
      download: {type: Boolean, default: false},
      compare: {type: Boolean, default: false},
      history: {type: Boolean, default: false}
    },
    data () {
      return {
        showHistory: false,
        dateText: null,
        active: '',
        expanded: []
      }
    },
    computed: {
      items () {
        if (this.itemAtTime) {
          return this.computeItems(this.itemAtTime)
        } else {
          return this.computeItems(this.item)
        }
      },
      time () {
        return new Date(this.dateText).getTime() / 1000
      },
      revisions () {
        // here were grouping revisions by time
        let revisions = {}
        this.patches.map(patch => {
          if (!(patch.time in revisions)) {
            revisions[patch.time] = {type: patch.type, time: patch.time, operations: [], initials: patch.initials}
          }
          revisions[patch.time].operations.push(patch)
        })
        return Object.values(revisions)
      },
      patches () {
        return this.$store.state.history[this._id] || []
      },
      _id () {
        return this.item._id
      },
      objectStates () {
        return this.$store.state.states[this._id] || {}
      },
      itemAtTime () {
        return this.objectStates[this.time]
      },
      name () {
        return this.$route.params.name
      },
      buttons () {
        return [
          {icon: 'compare_arrows', handle: this.clickedCompare, show: this.compare},
          {icon: 'cloud_download', handle: this.clickedDownload, show: this.download},
          {icon: 'history', handle: this.clickedHistory, show: this.history},
          {icon: 'edit', handle: this.clickedEdit, show: this.edit},
          {icon: 'delete', handle: this.clickedDelete, show: true}
        ]
      }
    },
    methods: {
      clickedDelete () {
        this.$store.dispatch('deleteItem', {object: this.object, _id: this._id})
      },
      clickedEdit () {
        router.push({name: `${this.object}/edit`, params: {name: this.name}})
      },
      clickedHistory () {
        if (!this.showHistory) {
          this.$store.dispatch('loadHistory', {object: this.object, _id: this._id})
        }
        this.showHistory = !this.showHistory
      },
      clickedCompare () {
        router.push({name: `${this.object}/compare`, params: {name: this.name}})
      },
      clickedDownload () {
        if (this.object !== COURSE) {
          return
        }
        this.$store.dispatch('excelExport', this._id)
      }
    },
    mounted () {
      if (this.actions && !this.object) {
        throw new Error('An object must be given if `actions === true`')
      }
    },
    watch: {
      dateText () {
        this.$store.dispatch('loadAtTime', {object: this.object, time: this.time, _id: this._id})
        this.timeChange(this.time)
      },
      _id () {
        if (this.showHistory) {
          this.$store.dispatch('loadHistory', {object: this.object, _id: this._id})
        }
      }
    }
  }
</script>

<style scoped>

</style>
