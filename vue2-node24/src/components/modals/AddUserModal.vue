<template>
  <div class="modal" :class="{'is-active': opened}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add new user</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">Username (unique identifier and CANNOT be changed once added)</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" :class="{'is-danger': !newUsernameValid}" type="text" placeholder="username" v-model="newUsername">
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
            <p class="help is-info">Username can only have lower case charactors, numbers and "-"</p>
          </div>
          <div class="field">
            <label class="label">Retype username</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" :class="{'is-danger': !retypedNewUsernameSame}" type="text" placeholder="username" v-model="newUsernameAgain">
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">Fullname</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" type="text" placeholder="fullname" v-model="newFullname">
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
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
          <a class="button is-link" :disabled="!newUsernameValid || !retypedNewUsernameSame" :class="{'is-loading': waiting}" @click="submit">Submit</a>
          <a class="button" @click="close">Cancel</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-user-modal',
  props: ['opened', 'allUsers'],
  data () {
    return {
      waiting: false,
      error: '',
      newUsername: '',
      newUsernameAgain: '',
      newFullname: '',
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
    newUsernameValid () {
      var newUsername = this.newUsername.trim()
      var usernames = this.allUsers ? this.allUsers.map(u => u.username) : []
      if (usernames.includes(newUsername)) {
        return false
      }
      var re = /^[a-z][-a-z0-9]*$/
      return re.test(newUsername)
    },
    retypedNewUsernameSame () {
      return this.newUsername === this.newUsernameAgain
    },
  },
  methods: {
    close(){
      this.$emit('closeAddUserModal')
    },
    submit () {
      if (!this.newUsernameValid || !this.retypedNewUsernameSame) {
        return
      }
      this.waiting = true
      var message = {
        username: this.myUsername,
        token: this.token,
        newUsername: this.newUsername.trim(),
        fullname: this.newFullname.trim()
      }
      this.$http.post(this.server + '/myapp/add-new-user/', message).then(resp => {
        this.error = ''
        this.waiting = false
        this.$emit('closeAddUserModal', this.newUsername.trim())
      }, err => {
        this.error = 'Faled to create user with username: ' + this.newUsername + '. Please try another username.'
        this.waiting = false
      })
    },
  },
}
</script>
