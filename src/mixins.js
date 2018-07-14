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
  },
  computed: {
    classes () {
      return Object.keys(this.$attrs)
    }
  }
}
