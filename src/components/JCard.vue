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
        <v-btn v-for="button in buttons" flat @click="button.handle" v-show="actions" :key="button.icon">
          <v-icon right left>{{ button.icon }}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <j-version-drawer :show="showHistory" :revisions="revisions"></j-version-drawer>

  </v-container>
</template>

<script>
  import { router } from '@/router'
  import JVersionDrawer from '@/components/JVersionDrawer'
  import JDatePicker from '@/components/inputs/JDatePicker'

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
      dateChange: {type: Function, default: () => {}}
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
        if (this.itemAtDate) {
          return this.computeItems(this.itemAtDate)
        } else {
          return this.computeItems(this.item)
        }
      },
      revisions () {
        let revisions = {}
        this.patches.map(patch => {
          if (!(patch.time in revisions)) {
            revisions[patch.time] = {type: patch.type, time: patch.time, operations: []}
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
      itemAtDate () {
        return this.objectStates[this.dateText]
      },
      name () {
        return this.$route.params.name
      },
      buttons () {
        return [
          {icon: 'compare_arrows', handle: this.clickedCompare},
          {icon: 'cloud_download', handle: this.clickedDownload},
          {icon: 'history', handle: this.clickedHistory},
          {icon: 'edit', handle: this.clickedEdit},
          {icon: 'delete', handle: this.clickedDelete}
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
        this.$store.dispatch('loadAtDate', {object: this.object, date: this.dateText, _id: this._id})
        this.dateChange(this.dateText)
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
