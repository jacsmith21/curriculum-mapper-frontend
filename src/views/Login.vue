<template>
  <v-slide-y-transition mode="out-in">
    <v-layout class="j-flex-column j-flex-center">
      <j-card-form title="Login" :submit="login" style="max-width: 600px; display: table" submitText="Login" :loading="loading">
        <j-text-field xs12 label="Username" v-model="user.username" required></j-text-field>
        <j-text-field xs12 label="Password" v-model="user.password" type="password" required></j-text-field>
        <p class="login">Haven't registered? <router-link :to="{name: 'register'}">Register</router-link></p>
      </j-card-form>
    </v-layout>
  </v-slide-y-transition>
</template>

<script>
  import JTextField from '@/components/inputs/JTextField'
  import JCardForm from '@/components/JCardForm'

  export default {
    name: 'Login',
    data () {
      return {
        user: {
          username: 'username',
          password: 'password'
        },
        loading: false
      }
    },
    components: {JCardForm, JTextField},
    methods: {
      login () {
        this.loading = true
        this.$store.dispatch('login', this.user)
          .then(() => { this.loading = false })
          .catch(() => { this.loading = false })
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
