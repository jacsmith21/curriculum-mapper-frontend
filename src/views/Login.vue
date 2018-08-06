<template>
  <v-slide-y-transition mode="out-in">
    <v-layout class="j-flex-column j-flex-center">
      <j-card-form title="Login" :submit="login" style="max-width: 600px; display: table" submitText="Login" :loading="loading">
        <v-alert :value="true" type="error" xs12 outline style="margin-bottom: 30px" v-if="errors">
          Username or password is incorrect.
        </v-alert>

        <j-text-field xs12 label="Username" v-model="user.username"></j-text-field>
        <j-text-field xs12 label="Password" v-model="user.password" type="password"></j-text-field>
        <p class="login">Haven't registered? <router-link :to="{name: 'register'}">Register</router-link></p>
      </j-card-form>
    </v-layout>
  </v-slide-y-transition>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  import JCardForm from '@/components/JCardForm'
  import { router } from '@/router'
  import { mapState } from 'vuex'

  export default {
    name: 'Register',
    data () {
      return {
        user: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    components: {JCardForm, JTextField},
    computed: {
      ...mapState(['errors'])
    },
    methods: {
      login () {
        this.loading = true
        this.$store.dispatch('login', this.user)
          .then(() => {
            this.loading = false  // Just to be explicit.
            router.push({name: 'home'})
          })
          .catch(e => {
            this.loading = false
            throw e
          })
      },
      cancel () {
        router.push({name: 'register'})
      }
    },
    destroyed () {
      this.$store.commit('setErrors', false)
    }
  }
</script>

<style scoped>
  .login {
    color: #4a4a4a;
    margin-top: 10px;
  }
</style>
