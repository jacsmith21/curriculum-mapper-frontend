<template>
  <v-container class="form-container">

    <h1>{{ title }}</h1>

    <v-form v-model="valid" ref="form">
      <v-container grid-list-lg style="padding-top: 0">
        <v-alert :value="true" type="error" xs12 outline style="margin-bottom: 30px" v-if="showError">
          {{ error }}
        </v-alert>
        <slot></slot>
      </v-container>
    </v-form>

    <v-divider class="mt-3"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-select v-if="edit" v-model="revisionType" :items="revisionItems" style="max-width: 150px" :error-messages="errorMessages"></v-select>
      <v-btn color="primary" flat @click="handleSubmit" :loading="loading" :disabled="disabled">{{ submitText }}</v-btn>
    </v-card-actions>

  </v-container>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'JCardForm',
    props: {
      title: String,
      object: {type: String, required: false},
      submit: {type: Function},
      editItem: {type: Object, required: false},
      loading: {type: Boolean, default: false},
      disabled: {type: Boolean, default: false}
    },
    data () {
      return {
        errorMessages: [],
        revisionType: '',
        revisionItems: ['Minor Revision', 'Major Revision'],
        revisionMap: {
          'Minor Revision': 'minor',
          'Major Revision': 'major'
        },
        valid: false
      }
    },
    computed: {
      submitText () {
        if (this.edit) {
          return 'Save'
        } else {
          return 'Submit'
        }
      },
      edit () {
        return !!this.editItem
      },
      type () {
        return this.revisionMap[this.revisionType]
      },
      showError () {
        return !!this.error
      },
      ...mapState(['error'])
    },
    methods: {
      handleSubmit () {
        if (!this.$refs.form.validate()) {
          return
        }

        if (this.submit) {
          this.submit()
          return
        } else {
          if (!this.object) {
            throw new Error('`object` prop must be given if the `submit` is not given.')
          }
        }

        if (this.edit) {
          if (!this.type) {
            this.errorMessages = ['Revision type is required.']
            return
          }

          this.$store.dispatch('patchItem', {object: this.object, item: this.editItem, type: this.type})
        } else {
          this.$store.dispatch('addItem', this.object)
        }
      }
    },
    mounted () {
      this.$store.commit('setError', '')
    },
    destroyed () {
      this.$store.commit('setError', '')
    },
    watch: {
      editItem: {
        immediate: true,
        handler () {
          if (!this.object) {
            return
          }
          this.$store.commit('resetForm', {object: this.object, item: this.editItem})
        }
      }
    }
  }
</script>

<style scoped>
  h1 {
    font-weight: 300;
    font-size: 2.4rem;
    margin-bottom: 1.5rem;
    padding-left: 16px;
  }

  .form-container {
    max-width: 850px;
  }
</style>
