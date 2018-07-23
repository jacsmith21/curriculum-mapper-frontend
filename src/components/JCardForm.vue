<template>
  <v-container class="form-container">

    <h1>{{ title }}</h1>

    <v-form>
      <v-container grid-list-lg style="padding-top: 0">
        <slot></slot>
      </v-container>
    </v-form>

    <v-divider class="mt-3"></v-divider>
    <v-card-actions>
      <v-btn v-if="cancel" flat @click="handleCancel"> Cancel </v-btn>
      <v-spacer></v-spacer>
      <v-select v-if="edit" v-model="revisionType" :items="revisionItems" style="max-width: 150px" :error-messages="errorMessages"></v-select>
      <v-btn color="primary" flat @click="handleSubmit">{{ submitText }}</v-btn>
    </v-card-actions>

  </v-container>
</template>

<script>
  import { router } from '@/router'

  export default {
    name: 'JCardForm',
    props: {
      title: String,
      cancel: {type: Boolean, default: false},
      object: {type: String, required: false},
      submit: {type: Function},
      editItem: {type: Object, required: false}
    },
    data () {
      return {
        errorMessages: [],
        revisionType: '',
        revisionItems: ['Minor Revision', 'Major Revision'],
        revisionMap: {
          'Minor Revision': 'minor',
          'Major Revision': 'major'
        }
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
      }
    },
    methods: {
      handleSubmit () {
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
            .then(() => {
              router.go(-1)
            })
            .catch(err => {
              throw err
            })
        } else {
          this.$store.dispatch('addItem', this.object)
            .catch(err => {
              throw err
            })
        }
      },
      handleCancel () {}
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
