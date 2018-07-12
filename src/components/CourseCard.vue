<template>
  <v-card>
    <v-list three-line v-if="course">
      <template v-for="(item, index) in items">
        <v-divider v-if="index !== 0"></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.label }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ course[item.key] || 'None' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>

    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>

  </v-card>
</template>


<script>
  import SidebarBase from '@/views/SidebarBase'
  import Date from '@/components/inputs/Date'

  export default {
    name: 'CourseCard',
    components: { SidebarBase, Date },
    props: {course: {type: Object, required: true}},
    computed: {
      items () {
        return [
          {label: 'Name', key: 'name'},
          {label: 'Title', key: 'title'},
          {label: 'Description', key: 'description'},
          {label: 'Maintainer', key: 'maintainer'},
          {label: 'Prerequisites', key: 'prerequisites'},
          {label: 'Corequisites', key: 'corequisites'},
          {label: 'Recommended', key: 'recommended'}
        ]
      }
    }
  }
</script>

<style scoped>

</style>
