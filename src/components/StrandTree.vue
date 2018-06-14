<template>
  <li>
    <div
      :class="{bold: isSection}"
      @click="toggle"
      @dblclick="changeType">
      {{ model.name }}
      <span v-if="isSection">[{{ open ? '-' : '+' }}]</span>
    </div>
    <ul v-show="open" v-if="isSection">
      <item
        class="item"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model">
      </item>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'StrandTree',
    computed: {
      isSection () {
        return true
      }
    }
  }
</script>

<style scoped>

</style>
