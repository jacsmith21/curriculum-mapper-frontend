<template>
  <sidebar-base>

  </sidebar-base>
</template>

<script>
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'Compare',
    components: { SidebarBase },
    computed: {
      name () {
        return this.$route.params.name
      },
      then () {
        return this.$route.params.then
      },
      now () {
        return this.$route.params.now
      }
    }
  }
</script>

<style scoped>

</style>
