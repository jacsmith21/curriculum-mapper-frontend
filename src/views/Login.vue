<template>
  <v-slide-y-transition mode="out-in">
    <v-layout class="j-flex-column j-flex-center">
        <j-card-form title="Login" :submit="login" style="max-width: 600px; display: table" submitText="Login">
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

  export default {
    name: 'Register',
    data () {
      return {
        user: {
          username: '',
          password: ''
        }
      }
    },
    components: {JCardForm, JTextField},
    methods: {
      login () {
        this.$store.dispatch('login', this.user)
      },
      cancel () {
        router.push({name: 'register'})
      }
    }
  }
</script>

<style scoped>
  .login {
    color: #4a4a4a;
    margin-top: 10px;
  }
</style>
