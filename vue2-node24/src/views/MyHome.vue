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
          <p class="help is-info">Default password: 123456</p>
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
    <div v-if="token">
      <div class="columns">
        <div class="column is-narrow">
          <div>
            <org-sidebar />
          </div>
        </div>
        <div class="column">
          <section class="section" >
            <div v-if="!usersMap">
              <span class="icon is-medium is-size-4">
                <i class="fas fa-spinner fa-pulse"></i>
              </span>
            </div>
            <div v-if="usersMap">
              <div v-if="error" class="notification is-danger is-light">
                <button class="delete" @click="error=''"></button>
                {{error}}
              </div>

              <div v-if="allUsers">
                <div class="mb-6">
                  <span class="is-pulled-right">
                    <div class="buttons">
                      <button class="button is-link is-outlined" :disabled="!canChangePassword" @click="openChangePasswordModal">Reset password</button>
                      <button class="button is-link is-outlined" v-if="myRole == 'owner' || myRole == 'admin'" @click="openEditUserModal">Edit user</button>
                      <button class="button is-link" v-if="myRole == 'owner' || myRole == 'admin'" @click="openAddUserModal">Add user</button>
                    </div>
                  </span>

                  <h4 class="title is-4">
                    <span>Users</span>&nbsp;
                    <span class="is-size-5 has-text-grey has-text-weight-normal">({{ allUsers.length }})</span>
                  </h4>
                </div>
                <table class="table is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Username</th>
                      <th>Full name</th>
                      <th>Email</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(u, index) in allUsers" :class="{'has-background-info-light': u.username == selectedUser, 'has-shadow': u.username == selectedUser}">
                      <td>
                        <div class="control">
                          <label class="radio">
                            <input type="radio" v-model="selectedUser" :value="u.username" />
                          </label>
                        </div>
                      </td>
                      <td>
                        <span class="tag is-light" :class="{'is-link': u.role == 'owner', 'is-info': u.role == 'admin'}">{{ u.role }}</span>&nbsp;
                        <span :class="{'has-text-grey-light': u.status == 'locked', 'ml-3': u.role == 'user', 'has-text-weight-bold': selectedUser == u.username}">{{ u.username }}</span>
                      </td>
                      <td>
                        <span :class="{'has-text-grey-light': u.status == 'locked'}">{{ u.fullname }}</span>
                      </td>
                      <td>
                        <span v-if="u.status != 'locked'">
                          <span class="tag">{{ u.username + '@' + domain }}</span>
                        </span>
                      </td>
                      <td>
                        <span v-if="u.status == 'active'" class="tag is-success is-light">
                          <i class="fas fa-check-circle"></i>&nbsp;
                          Enabled
                        </span>
                        <span v-if="u.status == 'password not set'" class="tag is-warning is-light">
                          <i class="fas fa-exclamation-circle"></i>&nbsp;
                          Password not set
                        </span>
                        <span v-if="u.status == 'locked'" class="tag is-light">
                          <i class="fas fa-ban"></i>&nbsp;
                          Disabled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

    </div>

    <add-user-modal :opened="addUserModal.opened" :allUsers="allUsers" @closeAddUserModal="closeAddUserModal" />
    <edit-user-modal :opened="editUserModal.opened" :user="editUserModal.user" @closeEditUserModal="closeEditUserModal" />
    <change-password-modal :opened="changePasswordModal.opened" :user="changePasswordModal.user" @closeChangePasswordModal="closeChangePasswordModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import AddUserModal from '../components/modals/AddUserModal.vue'
import EditUserModal from '../components/modals/EditUserModal.vue'
import ChangePasswordModal from '../components/modals/ChangePasswordModal.vue'
import OrgSidebar from '../components/OrgSidebar.vue'

export default {
  name: 'my-home',
  components: {
    AddUserModal,
    EditUserModal,
    ChangePasswordModal,
    OrgSidebar
  },
  data () {
    return {
      username: 'demo-admin',
      password: '123456',
      rememberMe: true,
      error: '',
      waiting: false,
      selectedUser: '',
      addUserModal: {
        opened: false
      },
      editUserModal: {
        opened: false,
        user: null
      },
      changePasswordModal: {
        opened: false,
        user: null
      },
    }
  },
  computed: {
    server () {
      return this.$store.state.config.server
    },
    domain () {
      return this.$store.state.config.domain
    },
    token () {
      return this.$store.state.user.token
    },
    myUsername () {
      return this.$store.state.user.username
    },
    myRole () {
      return this.$store.state.user.role
    },
    usersMap () {
      return this.$store.state.org.usersMap
    },
    allUsers () {
      if (!this.usersMap) {
        return []
      }
      var allUsers = Object.values(this.usersMap).sort((a, b) => {
        if (a.role != b.role) {
          var roles = ['owner', 'admin', 'user']
          return roles.indexOf(a.role) - roles.indexOf(b.role)
        }
        if (a.status != b.status) {
          var statuses = ['active', 'password not set', 'locked', 'unknown']
          return statuses.indexOf(a.status) - statuses.indexOf(b.status)
        }
        return (a.username > b.username) ? 1 : -1
      })
      return allUsers
    },
    canChangePassword () {
      if (!this.usersMap) {
        return false
      }
      var u = this.usersMap[this.selectedUser]
      if (!u) {
        return false
      }
      if (u.status == 'locked') {
        return false
      }
      if (this.myRole == 'user') {
        return this.myUsername == u.username
      }
      return true
    },
  },
  watch: {
    token: function (val) {
      if (val) {
        this.selectedUser = this.myUsername
      }
    },
  },
  methods: {
    signin () {
      this.username = this.username.trim().toLowerCase()
      this.waiting = true
      var message = {username: this.username, password: this.password}
      this.$http.post(this.server + '/myapp/login-user/', message).then(resp => {
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
          this.getUsers()
          this.getGroups()
        } else {
          this.error = 'Failed to sign in!'
          this.$store.commit('user/reset')
        }
        this.error = ''
        this.waiting = false
      }, err => {
        this.error = err.body
        this.waiting = false
      })
    },
    getUsers () {
      var message = {
        username: this.myUsername,
        token: this.token,
      }
      this.$http.post(this.server + '/myapp/get-org-users/', message).then(resp => {
        this.$store.commit('org/setUsersMap', resp.body)
      }, err => {
        this.error = err.body
        this.$store.commit('user/reset')
        this.$store.commit('org/reset')
      })
    },
    getGroups () {
      var message = {
        username: this.myUsername,
        token: this.token,
      }
      this.$http.post(this.server + '/myapp/get-org-groups/', message).then(resp => {
        this.$store.commit('org/setGroups', resp.body)
      }, err => {
        this.error = err.body
      })
    },
    openAddUserModal () {
      this.addUserModal.opened = true
    },
    closeAddUserModal (result) {
      if (result) {
        this.getUsers()
        this.selectedUser = result
      }
      this.addUserModal.opened = false
    },
    openEditUserModal () {
      if (!this.usersMap || !this.selectedUser) {
        return
      }
      this.editUserModal.user = this.usersMap[this.selectedUser]
      this.editUserModal.opened = true
    },
    closeEditUserModal (result) {
      if (result) {
        this.getUsers()
      }
      this.editUserModal.opened = false
    },
    openChangePasswordModal () {
      if (!this.usersMap || !this.selectedUser) {
        return
      }
      this.changePasswordModal.user = this.usersMap[this.selectedUser]
      this.changePasswordModal.opened = true
    },
    closeChangePasswordModal (result) {
      this.changePasswordModal.user = null
      this.changePasswordModal.opened = false
      if (result) {
        this.getUsers()
      }
    },
  },
  mounted () {
    if (this.token) {
      this.selectedUser = this.myUsername
    }
  },
}
</script>

<style scoped>
</style>
