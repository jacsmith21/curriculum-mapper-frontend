<template>
  <v-menu :nudge-width="100">
    <v-toolbar-title slot="activator">
      <slot>
        <v-btn flat round style="margin: 0">
          <span>{{ label }}</span>
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </slot>
    </v-toolbar-title>

    <v-list>
      <v-list-tile
        v-for="item in processedItems"
        :key="item.label"
        @click="item.click"
      >
        <v-list-tile-title>{{ item.label }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
  import { router } from '@/router'

  export default {
    name: 'JToolbarDropdown',
    props: {label: String, items: Array},
    computed: {
      processedItems () {
        return this.items.map(([label, action]) => {
          if (this._.isFunction(action)) {
            return {
              click: action,
              label: label
            }
          } else {
            return {
              click: () => router.push(action),
              label: label
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
