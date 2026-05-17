<template>
  <div class="modal" :class="{'is-active': opened}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Set password</p>
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
          <div class="field">
          <label class="label">New password</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input" :class="{'is-danger': !newPasswordValid}" type="password" placeholder="New password" v-model="newPassword">
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
          </div>
        </div>
          <div class="field">
            <label class="label">Retype new password</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" :class="{'is-danger': !retypedNewPasswordSame}" type="password" placeholder="New password again" v-model="newPasswordAgain">
              <span class="icon is-small is-left">
                <i class="fas fa-key"></i>
              </span>
            </div>
          </div>
        </div>
        <div v-if="success" class="notification is-success is-light mt-5">
          <button class="delete" @click="error=''"></button>
          {{success}}
        </div>
        <div v-if="error" class="notification is-danger is-light mt-5">
          <button class="delete" @click="error=''"></button>
          {{error}}
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <a class="button is-link" :disabled="!newPasswordValid || !retypedNewPasswordSame" :class="{'is-loading': waiting}" @click="submit">Submit</a>
          <a class="button" @click="close">Close</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'change-password-modal',
  props: ['opened', 'user'],
  data () {
    return {
      waiting: false,
      success: '', 
      error: '',
      newPassword: '',
      newPasswordAgain: '',
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
    newPasswordValid () {
      var newPassword = this.newPassword.trim()
      return newPassword.length >= 6
    },
    retypedNewPasswordSame () {
      return this.newPassword === this.newPasswordAgain
    },
  },
  methods: {
    close(){
      this.$emit('closeChangePasswordModal', this.success)
    },
    submit () {
      if (!this.newPasswordValid || !this.retypedNewPasswordSame) {
        return
      }
      this.waiting = true
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: this.user.username,
        newPassword: this.newPassword.trim(),
      }
      this.$http.post(this.server + '/myapp/change-password/', message).then(resp => {
        this.success = 'Successfully changed password'
        this.error = ''
        this.waiting = false
      }, err => {
        this.success = ''
        this.error = 'Failed to change the password!'
        this.waiting = false
      })
    },
  },
}
</script>
