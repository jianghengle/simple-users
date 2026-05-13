<template>
  <div>
    <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
      <div class="container p-3">
        <div class="navbar-brand">
          <router-link class="navbar-item is-size-4 has-text-weight-bold" :to="'/'">
            Email admin
          </router-link>
          

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
            :class="{'is-active': menuActive}" @click="menuActive = !menuActive">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu"  :class="{'is-active': menuActive}">
          <div class="navbar-start">
          </div>

          <div class="navbar-end">
            <a class="navbar-item" v-if="token" @click="signout">
              <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
              </span>
              <span>Sign out</span>
            </a>

            <a class="navbar-item" target="_blank" href="https://mailapp.myworkflowhub.com">
              <span class="icon">
                <i class="fas fa-envelope"></i>
              </span>
              <span>Mail app</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'my-header',
  data () {
    return {
      menuActive: false
    }
  },
  computed: {
    token () {
      return this.$store.state.user.token
    },
    routerPath () {
      return this.$route.path
    },
    server () {
      return this.$store.state.config.server
    },
    orgWorkflowConfigs () {
      return this.$store.state.org.orgWorkflowConfigs
    },
  },
  methods: {
    signout () {
      this.$store.commit('user/reset')
    },
  },
  mounted () {

  }
}
</script>