<template>
  <v-slide-y-transition mode="out-in">
    <v-layout class="j-flex-column j-flex-center">
      <j-card-form title="Register" :submit="register" style="max-width: 600px" submit-text="Register">
        <j-text-field xs12 label="Username" v-model="user.username"></j-text-field>
        <j-text-field xs12 label="Initial" v-model="user.initial"></j-text-field>
        <j-text-field xs12 label="Password" v-model="user.password" type="password"></j-text-field>
        <j-text-field xs12 label="Confirm Password" v-model="user.confirmPassword" type="password"></j-text-field>
        <j-text-field xs12 label="Code" v-model="user.code"></j-text-field>
        <p class="register">Already registered? <router-link :to="{name: 'login'}">Login</router-link></p>
      </j-card-form>
    </v-layout>
  </v-slide-y-transition>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  import JCardForm from '@/components/JCardForm'

  export default {
    name: 'Register',
    data () {
      return {
        user: {
          username: '',
          password: '',
          confirmPassword: '',
          initial: '',
          code: ''
        }
      }
    },
    components: {JCardForm, JTextField},
    methods: {
      register () {
        this.$store.dispatch('register', this.user)
      }
    }
  }
</script>

<style scoped>
  .register {
    padding-left: 14px;
    color: #4a4a4a;
    margin-top: 10px;
  }
</style>
