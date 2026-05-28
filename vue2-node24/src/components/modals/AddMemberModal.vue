<template>
  <div class="modal" :class="{'is-active': opened}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add member</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">Group name</label>
            <div class="control">
              <input class="input" type="text" readonly :value="groupName">
            </div>
          </div>

          <div class="field">
            <label class="label">First member</label>
            <div class="control">
              <div class="select">
                <select v-model="newUsername">
                  <option v-for="username in usernames">{{ username }}</option>
                </select>
              </div>
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
          <a class="button is-link" :disabled="!newUsername" :class="{'is-loading': waiting}" @click="submit">Submit</a>
          <a class="button" @click="close">Cancel</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-group-modal',
  props: ['opened', 'usernames', 'groupName'],
  data () {
    return {
      waiting: false,
      error: '',
      newUsername: '',
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
  },
  methods: {
    close(){
      this.$emit('closeAddMemberModal')
    },
    submit () {
      if (!this.newUsername) {
        return
      }
      this.waiting = true
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: this.newUsername,
        group: this.groupName
      }
      this.$http.post(this.server + '/myapp/add-user-to-group/', message).then(resp => {
        this.error = ''
        this.waiting = false
        this.$emit('closeAddMemberModal', this.newUsername)
      }, err => {
        this.error = err.body
        this.waiting = false
      })
    },
  },
}
</script>
