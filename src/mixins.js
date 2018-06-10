import { mapMutations, mapGetters } from 'vuex'

export const vmodel = {
  props: ['value'],
  data () {
    return {
      content: this.value
    }
  },
  methods: {
    input () {
      this.$emit('input', this.content)
    }
  }
}

export const dynamic = {
  computed: mapGetters(['lastIndex']),
  methods: {
    clickedIcon (key, index) {
      const that = this
      return () => {
        that.clickedDynamicInput({key: key, index: index})
      }
    },
    ...mapMutations(['clickedDynamicInput'])
  }
}
