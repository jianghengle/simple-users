<template>
  <div class="modal" :class="{'is-active': opened}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit user</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-static" type="text" readonly :value="user ? user.username: ''">
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div class="notification is-danger is-light" v-if="userDisabled">
            The User has been disabled! You can enable the user by clicking the button below.
          </div>

          <div class="field" v-if="!userDisabled && newEnabled">
            <label class="label">Role</label>
            <div class="control" v-if="!canEditRole">
              <input class="input" type="text" readonly :value="user ? user.role : ''">
            </div>
            <div class="control" v-if="canEditRole">
              <div class="select">
                <select v-model="newRole">
                  <option>admin</option>
                  <option>user</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field" v-if="!userDisabled && newEnabled">
            <label class="label">Fullname</label>
            <div class="control">
              <input class="input" type="text" placeholder="fullname" v-model="newFullname">
            </div>
          </div>
        </div>
        <div v-if="error" class="notification is-danger is-light mt-5">
          <button class="delete" @click="error=''"></button>
          {{error}}
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <a class="button is-link" :disabled="!changed" :class="{'is-loading': waiting}" @click="update" v-if="!userDisabled">Update user</a>
          <a class="button is-danger is-outlined" :disabled="changed" :class="{'is-loading': waiting}" @click="lockUser" v-if="!userDisabled && canDisable">Disable user</a>
          <a class="button is-success is-outlined" :class="{'is-loading': waiting}" @click="unlockUser" v-if="userDisabled && canEnable">Enable user</a>
          <a class="button" @click="close">Cancel</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-user-modal',
  props: ['opened', 'user'],
  data () {
    return {
      waiting: false,
      error: '',
      newEnabled: true,
      newFullname: '',
      newRole: '',
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
    fullnameChanged () {
      return this.user && (this.user.fullname != this.newFullname)
    },
    roleChanged () {
      return this.user && (this.user.role != this.newRole)
    },
    changed () {
      return this.fullnameChanged || this.roleChanged
    },
    userDisabled () {
      return this.user && this.user.status == 'locked'
    },
    canEditRole () {
      if (!this.user) {
        return false
      }
      if (this.myRole == 'user') {
        return false
      }
      if (this.user.role == 'owner') {
        return false
      }
      if (this.user.status == 'locked') {
        return false
      }
      if (this.myUsername == this.user.username) {
        return false
      }
      return true
    },
    canDisable () {
      if (!this.user) {
        return false
      }
      if (this.myRole == 'user') {
        return false
      }
      if (this.user.role == 'owner' || this.user.role == 'admin') {
        return false
      }
      if (this.myUsername == this.user.username) {
        return false
      }
      return true
    },
    canEnable () {
      if (!this.user) {
        return false
      }
      if (this.myRole == 'user') {
        return false
      }
      if (this.user.role != 'user') {
        return false
      }
      if (this.myUsername == this.user.username) {
        return false
      }
      return true
    },
  },
  watch: {
    user: function (val) {
      if (val) {
        this.newEnabled = val.status != 'locked'
        this.newFullname = val.fullname
        this.newRole = val.role
      }
    },
  },
  methods: {
    close(){
      this.$emit('closeEditUserModal')
    },
    update () {
      if (!this.changed) {
        return
      }
      
      if (this.roleChanged) {
        var message = {
          username: this.myUsername,
          token: this.token,
          actionUsername: this.user.username,
          newRole: this.newRole,
        }
        this.$http.post(this.server + '/myapp/change-role/', message).then(resp => {
          if (this.fullnameChanged) {
            this.updateFullname()
          } else {
            this.error = ''
            this.waiting = false
            this.$emit('closeEditUserModal', true)
          }
        }, err => {
          this.error = err.body
          this.waiting = false
        })
      } else if (this.fullnameChanged) {
        this.updateFullname()
      }
    },
    updateFullname () {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: this.user.username,
        newFullname: this.newFullname,
      }
      this.$http.post(this.server + '/myapp/change-fullname/', message).then(resp => {
        this.error = ''
        this.waiting = false
        this.$emit('closeEditUserModal', true)
      }, err => {
        this.error = err.body
        this.waiting = false
      })
    },
    lockUser () {
      if (this.changed || !this.canDisable) {
        return
      }
      var confirm = {
        title: 'Disable user',
        message: 'Are you sure to lock this user: "' + this.user.username + '"? The user cannot login after disabled',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.lockUserConfirmed,
          args: []
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    lockUserConfirmed () {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: this.user.username,
      }
      this.$http.post(this.server + '/myapp/lock-user/', message).then(resp => {
        this.error = ''
        this.waiting = false
        this.$emit('closeEditUserModal', true)
      }, err => {
        this.error = err.body
        this.waiting = false
      })
    },
    unlockUser () {
      if (this.changed || !this.canEnable) {
        return
      }
      var confirm = {
        title: 'Enable user',
        message: 'Are you sure to enable this user: "' + this.user.username + '"? The user can login after enabled',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.unlockUserConfirmed,
          args: []
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    unlockUserConfirmed () {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: this.user.username,
      }
      this.$http.post(this.server + '/myapp/unlock-user/', message).then(resp => {
        this.error = ''
        this.waiting = false
        this.$emit('closeEditUserModal', true)
      }, err => {
        this.error = err.body
        this.waiting = false
      })
    },
  },
}
</script>
