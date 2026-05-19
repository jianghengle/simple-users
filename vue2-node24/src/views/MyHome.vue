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
    <section class="section" v-if="token">
      <div v-if="waiting">
        <span class="icon is-medium is-size-4">
          <i class="fas fa-spinner fa-pulse"></i>
        </span>
      </div>
      <div v-if="allUsers">
        <div v-if="error" class="notification is-danger is-light">
          <button class="delete" @click="error=''"></button>
          {{error}}
        </div>
        <div class="tabs">
          <ul>
            <li v-for="g in groups" :class="{'is-active':currentGroup == g}">
              <a @click="currentGroup = g">{{ g }}</a>
            </li>
          </ul>
        </div>

        <div v-if="currentGroup == 'all'">
          <table class="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <td>
                  <span class="has-text-weight-bold">Username</span>&nbsp;
                  <label class="checkbox" v-if="myRole == 'owner' || myRole == 'admin'">
                    <input type="checkbox" v-model="showLocked" />
                    Locked
                  </label>
                </td>
                <th>Role</th>
                <th>Groups</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(u, index) in allUsers" v-if="u.status != 'locked' || showLocked">
                <td :class="{'has-text-weight-bold': myUsername == u.username}">{{ index + 1 }}</td>
                <td>
                  <span :class="{'has-text-weight-bold': myUsername == u.username, 'strikethrough': u.status == 'locked'}">{{ u.username }}</span>&nbsp;
                  <span class="tag is-warning" v-if="u.status == 'password not set'">{{ u.status }}</span>
                  <span class="tag is-light" v-if="u.status == 'locked'">{{ u.status }}</span>
                </td>
                <td>
                  <span :class="{'has-text-weight-bold': myUsername == u.username}" v-if="!canEditRole(u)">{{ u.role }}</span>
                  <a v-if="canEditRole(u) && roleEdit != u.username" @click="roleEdit = u.username">{{ u.role }}</a>
                  <div class="select" v-if="canEditRole(u) && roleEdit == u.username">
                    <select v-model="u.role" @change="userRoleChanged(u)">
                      <option>admin</option>
                      <option>user</option>
                    </select>
                  </div>
                </td>
                <td>
                  <span class="tag" v-for="g in userGroups[u.username]">
                    {{ g }}
                    <button v-if="canEditGroups" class="delete is-small" @click="removeUserFromGroup(u, g)"></button>
                  </span>
                  <button class="button is-small is-white" v-if="canEditGroups && groupsEdit != u.username" @click="groupsEdit = u.username">
                    <span class="icon is-small">
                      <i class="fas fa-plus"></i>
                    </span>
                  </button>
                  <div v-if="canEditGroups && groupsEdit == u.username">
                    <div class="field has-addons">
                      <p class="control">
                        <span class="select">
                          <select v-model="groupToAdd">
                            <option v-for="g in getAvailableGroups(u)">{{ g }}</option>
                          </select>
                        </span>
                      </p>
                      <p class="control" v-if="groupToAdd == 'New'">
                        <input class="input" type="text" placeholder="New group" v-model="newGroup">
                      </p>
                      <p class="control">
                        <button class="button" v-if="groupToAdd" :disabled="groupToAdd == 'New' && !newGroupGood" @click="addUserToGroup(u)">
                          <span class="icon is-small">
                            <i class="fas fa-plus"></i>
                          </span>
                        </button>
                        <button class="button" v-if="!groupToAdd" @click="groupsEdit = null">
                          <span class="icon is-small">
                            <i class="fas fa-times"></i>
                          </span>
                        </button>
                      </p>
                    </div>
                    <p v-if="groupToAdd == 'New'" class="help is-info group-name-help">Group name only allows lower case characters, numbers, and '-'</p>
                  </div>
                </td>
                <td>
                  <p class="buttons">
                    <button class="button is-small" v-if="canChangePassword(u)" @click="openChangePasswordModal(u)">
                      <span class="icon is-small">
                        <i class="fas fa-key"></i>
                      </span>
                    </button>
                    <button class="button is-small" v-if="canLock(u)" @click="lockUser(u)">
                      <span class="icon is-small">
                        <i class="fas fa-lock"></i>
                      </span>
                    </button>
                    <button class="button is-small" v-if="canUnlock(u)" @click="unlockUser(u)">
                      <span class="icon is-small">
                        <i class="fas fa-lock-open"></i>
                      </span>
                    </button>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link" @click="openAddUserModal">Add new user</button>
            </div>
          </div>
        </div>
        <div v-else>
          <table class="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <td>
                  <span class="has-text-weight-bold">Username</span>&nbsp;
                  <label class="checkbox" v-if="myRole == 'owner' || myRole == 'admin'">
                    <input type="checkbox" v-model="showLocked" />
                    Locked
                  </label>
                </td>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(u, index) in groupUserRoles[currentGroup]" v-if="u.status != 'locked' || showLocked">
                <td :class="{'has-text-weight-bold': myUsername == u.username}">{{ index + 1 }}</td>
                <td :class="{'has-text-weight-bold': myUsername == u.username, 'strikethrough': u.status == 'locked'}">{{ u.username }}</td>
                <td :class="{'has-text-weight-bold': myUsername == u.username}">{{ u.role }}</td>
                <td>
                  <p class="buttons">
                    <button class="button is-small" v-if="canCurrentGroupRemoveUser" @click="currentGroupRemoveUser(u)">
                      <span class="icon is-small">
                        <i class="fas fa-user-slash"></i>
                      </span>
                    </button>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-danger" @click="deleteGroup">Delete group</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <add-user-modal :opened="addUserModal.opened" :allUsers="allUsers" @closeAddUserModal="closeAddUserModal" />
    <change-password-modal :opened="changePasswordModal.opened" :user="changePasswordModal.user" @closeChangePasswordModal="closeChangePasswordModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import AddUserModal from '../components/modals/AddUserModal.vue'
import ChangePasswordModal from '../components/modals/ChangePasswordModal.vue'

export default {
  name: 'my-home',
  components: {
    AddUserModal,
    ChangePasswordModal
  },
  data () {
    return {
      username: 'demo-admin',
      password: '123456',
      rememberMe: true,
      error: '',
      waiting: false,
      allUsers: null,
      groups: ['all'],
      currentGroup: 'all',
      groupUsers: {},
      roleEdit: null,
      groupsEdit: null,
      groupToAdd: '',
      newGroup: '',
      addUserModal: {
        opened: false
      },
      changePasswordModal: {
        opened: false,
        user: null
      },
      showLocked: false,
    }
  },
  computed: {
    server () {
      return this.$store.state.config.server
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
    userGroups () {
      var result = {}
      for (var g in this.groupUsers) {
        var users = this.groupUsers[g]
        for (var u of users) {
          if (!result[u]) {
            result[u] = []
          }
          result[u].push(g)
        }
      }
      return result
    },
    groupUserRoles () {
      var userMap = {}
      for (var u of this.allUsers) {
        userMap[u.username] = u
      }
      var result = {}
      for (var g in this.groupUsers) {
        var users = this.groupUsers[g].map(u => userMap[u])
        result[g] = users.sort((a, b) => {
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
      }
      return result
    },
    newGroupGood () {
      var newGroup = this.newGroup.trim()
      if (this.groups.includes(newGroup)) {
        return false
      }
      var re = /^[a-z][-a-z0-9]*$/
      return re.test(newGroup)
    },
    canEditGroups () {
      if (this.myRole == 'user') {
        return false
      }
      return true
    },
    canCurrentGroupRemoveUser () {
      if (this.myRole == 'user') {
        return false
      }
      return this.groupUsers[this.currentGroup].length > 1
    },
  },
  watch: {
    token: function (val) {
      if (val) {
        this.getUsers()
        this.getGroups()
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
      this.waiting = true
      var message = {
        username: this.myUsername,
        token: this.token,
      }
      this.$http.post(this.server + '/myapp/get-org-users/', message).then(resp => {
        this.allUsers = resp.body.sort((a, b) => {
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
        this.error = ''
        this.waiting = false
      }, err => {
        this.error = err.body
        this.waiting = false
        this.$store.commit('user/reset')
      })
    },
    getGroups () {
      var message = {
        username: this.myUsername,
        token: this.token,
      }
      this.$http.post(this.server + '/myapp/get-org-groups/', message).then(resp => {
        var groups = ['all']
        var groupUsers = {}
        for (var g of resp.body) {
          if (g.group == 'all') {
            continue
          }
          groups.push(g.group)
          groupUsers[g.group] = g.users
        }
        this.groups = groups
        this.groupUsers = groupUsers
      }, err => {
        this.error = err.body
      })
    },
    canEditRole (u) {
      if (this.myRole == 'user') {
        return false
      }
      if (u.role == 'owner') {
        return false
      }
      if (this.myUsername == u.username) {
        return false
      }
      return true
    },
    userRoleChanged (u) {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: u.username,
        newRole: u.role,
      }
      this.$http.post(this.server + '/myapp/change-role/', message).then(resp => {
        this.roleEdit = null
      }, err => {
        this.error = err.body
      })
    },
    getAvailableGroups (u) {
      var currentGroups = this.userGroups[u.username]
      var availableGroups = []
      for (var g of this.groups) {
        if (g == 'all') {
          continue
        }
        if (currentGroups && currentGroups.includes(g)) {
          continue
        }
        availableGroups.push(g)
      }
      availableGroups.push('New')
      availableGroups.unshift('')
      return availableGroups
    },
    addUserToGroup (u) {
      if (this.groupToAdd == 'New' && !this.newGroupGood) {
        return
      }
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: u.username,
        group: this.groupToAdd == 'New' ? this.newGroup : this.groupToAdd,
      }
      this.$http.post(this.server + '/myapp/add-user-to-group/', message).then(resp => {
        this.getGroups()
        this.groupsEdit = null
        this.groupToAdd = ''
        this.newGroup = ''
      }, err => {
        this.error = err.body
      })
    },
    removeUserFromGroup (u, g) {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: u.username,
        group: g,
      }
      this.$http.post(this.server + '/myapp/remove-user-from-group/', message).then(resp => {
        this.getGroups()
      }, err => {
        this.error = err.body
      })
    },
    deleteGroup () {
      var confirm = {
        title: 'Delete group',
        message: 'Are you sure to delete this group: "' + this.currentGroup + '"? The users will NOT be deleted.',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.deleteGroupConfirmed,
          args: []
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    deleteGroupConfirmed () {
      var message = {
        username: this.myUsername,
        token: this.token,
        group: this.currentGroup,
      }
      this.$http.post(this.server + '/myapp/remove-group/', message).then(resp => {
        this.getGroups()
        this.currentGroup = 'all'
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
      }
      this.addUserModal.opened = false
    },
    canChangePassword (u) {
      if (this.myRole == 'user') {
        return this.myUsername == u.username
      }
      return true
    },
    openChangePasswordModal (u) {
      this.changePasswordModal.user = u
      this.changePasswordModal.opened = true
    },
    closeChangePasswordModal (result) {
      this.changePasswordModal.user = null
      this.changePasswordModal.opened = false
      if (result) {
        this.getUsers()
      }
    },
    canLock (u) {
      if (this.myRole == 'user') {
        return false
      }
      if (u.role != 'user') {
        return false
      }
      if (u.username == this.myUsername) {
        return false
      }
      return u.status == 'active'
    },
    lockUser (u) {
      var confirm = {
        title: 'Lock user',
        message: 'Are you sure to lock this user: "' + u.username + '"? The user cannot login after locked',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.lockUserConfirmed,
          args: [u]
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    lockUserConfirmed (u) {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: u.username,
      }
      this.$http.post(this.server + '/myapp/lock-user/', message).then(resp => {
        this.getUsers()
      }, err => {
        this.error = err.body
      })
    },
    canUnlock (u) {
      if (this.myRole == 'user') {
        return false
      }
      return u.status == 'locked'
    },
    unlockUser (u) {
      var confirm = {
        title: 'Unlock user',
        message: 'Are you sure to unlock this user: "' + u.username + '"? The user can login after unlocked',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.unlockUserConfirmed,
          args: [u]
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    unlockUserConfirmed (u) {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: u.username,
      }
      this.$http.post(this.server + '/myapp/unlock-user/', message).then(resp => {
        this.getUsers()
      }, err => {
        this.error = err.body
      })
    },
    currentGroupRemoveUser (u) {
      var confirm = {
        title: 'Remove user from group',
        message: 'Are you sure to remove this user: "' + u.username + '" from the current group "' + this.currentGroup + '"?',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.currentGroupRemoveUserConfirmed,
          args: [u]
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    currentGroupRemoveUserConfirmed (u) {
      this.removeUserFromGroup(u, this.currentGroup)
    },
  },
  mounted () {
    if (this.token) {
      this.getUsers()
      this.getGroups()
    }
  },
}
</script>

<style scoped>
.group-name-help {
  margin-top: -10px;
}
.strikethrough {
  text-decoration: line-through;
}
</style>
