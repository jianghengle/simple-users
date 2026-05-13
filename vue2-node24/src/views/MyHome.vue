<template>
  <div class="container">
    <section class="section" v-if="!token">
      <h1 class="title is-5">Manage @myworkflowhub.com</h1>
      <h2 class="subtitle is-6 mt-2">
        Users, groups and passwords
      </h2>

      <div>
        <div class="field">
          <label class="label">Username</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input" type="text" placeholder="Username" v-model="username">
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input" type="password" placeholder="Password" v-model="password" @keyup.enter="signin">
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="rememberMe">
              Remember me
            </label>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" :class="{'is-loading': waiting}" @click="signin">Sign in</button>
          </div>
        </div>

        <div v-if="error" class="notification is-danger is-light">
          <button class="delete" @click="error=''"></button>
          {{error}}
        </div>
      </div>
    </section>
    <section class="section" v-if="token">
      users table
    </section>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'my-home',
  data () {
    return {
      username: '',
      password: '',
      rememberMe: true,
      error: '',
      waiting: false,
    }
  },
  computed: {
    server () {
      return this.$store.state.config.server
    },
    token () {
      return this.$store.state.user.token
    },
  },
  methods: {
    signin () {
      this.username = this.username.trim().toLowerCase()
      this.waiting = true
      var message = {username: this.username, password: this.password}
      this.$http.post(this.server + '/myapp/login-user', message).then(resp => {
        if (resp.body) {
          var user = resp.body
          this.$store.commit('user/setUser', user)
          if (this.rememberMe) {
            localStorage.setItem('token', user.token)
            localStorage.setItem('role', user.role)
            localStorage.setItem('username', user.username)
          }
          this.username = ''
          this.password = ''
        } else {
          this.error = 'Failed to sign in!'
          this.$store.commit('user/reset')
        }
        this.waiting = false
      }, err => {
        this.error = err.body
        this.waiting = false
      })
    },
  },
}
</script>
