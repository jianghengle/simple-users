<template>
  <div class="modal" :class="{'is-active': opened}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add new group</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">Group name</label>
            <div class="control">
              <input class="input" :class="{'is-danger': !newGroupNameValid}" type="text" placeholder="Group name" v-model="newGroupName">
            </div>
            <p class="help is-info">Username can only have lower case charactors, numbers and "-"</p>
          </div>

          <div class="field">
            <label class="label">First member</label>
            <div class="control">
              <div class="select">
                <select v-model="firstUsername">
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
          <a class="button is-link" :disabled="!newGroupNameValid || !firstUsername" :class="{'is-loading': waiting}" @click="submit">Submit</a>
          <a class="button" @click="close">Cancel</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-group-modal',
  props: ['opened', 'usernames', 'groups'],
  data () {
    return {
      waiting: false,
      error: '',
      newGroupName: '',
      firstUsername: '',
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
    newGroupNameValid () {
      var newGroupName = this.newGroupName.trim()
      var groupNames = this.groups ? this.groups.map(g => g.group) : []
      var defaultGroups = ['postmaster', 'root', 'all']
      groupNames.push(...defaultGroups)
      if (groupNames.includes(newGroupName)) {
        return false
      }
      var re = /^[a-z][-a-z0-9]*$/
      return re.test(newGroupName)
    },
  },
  methods: {
    close(){
      this.$emit('closeAddGroupModal')
    },
    submit () {
      if (!this.newGroupNameValid) {
        return
      }
      this.waiting = true
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: this.firstUsername,
        group: this.newGroupName
      }
      this.$http.post(this.server + '/myapp/add-user-to-group/', message).then(resp => {
        this.error = ''
        this.waiting = false
        this.$emit('closeAddGroupModal', true)
      }, err => {
        this.error = err.body
        this.waiting = false
      })
    },
  },
}
</script>
