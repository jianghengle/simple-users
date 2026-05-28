<template>
  <div class="container">
    <div v-if="token">
      <div class="columns">
        <div class="column is-narrow">
          <div>
            <org-sidebar />
          </div>
        </div>
        <div class="column">
          <section class="section" >
            <div v-if="!groups">
              <span class="icon is-medium is-size-4">
                <i class="fas fa-spinner fa-pulse"></i>
              </span>
            </div>
            <div v-if="groups">
              <div v-if="error" class="notification is-danger is-light">
                <button class="delete" @click="error=''"></button>
                {{error}}
              </div>

              <div>
                <h4 class="title is-4">
                  <span class="tag is-medium">{{ groupName + '@' + domain }}</span>
                </h4>
                <div class="mb-6">
                  <span class="is-pulled-right">
                    <div class="buttons">
                      <button class="button is-danger is-outlined" v-if="myRole == 'owner' || myRole == 'admin'" :class="{'is-loading': removingGroup}" @click="removeGroup">Remove group</button>
                      <button class="button is-link is-outlined" v-if="myRole == 'owner' || myRole == 'admin'" :class="{'is-loading': removingMember}" :disabled="!canRemoveMember" @click="removeMember">Remove member</button>
                      <button class="button is-link" v-if="myRole == 'owner' || myRole == 'admin'" :disabled="!usernamesToAdd.length" @click="addMemberModal.opened = true">Add member</button>
                    </div>
                  </span>
                  
                  <h4 class="title is-4">
                    <span>
                      Members
                    </span>
                    <span class="is-size-5 has-text-grey has-text-weight-normal">({{ groups.length }})</span>
                  </h4>
                </div>
                <table class="table is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Username</th>
                      <th>Full name</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(u, index) in groupUsers" :class="{'has-background-info-light': u.username == selectedUser, 'has-shadow': u.username == selectedUser}">
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
      <add-member-modal :opened="addMemberModal.opened" :usernames="usernamesToAdd" :groupName="groupName" @closeAddMemberModal="closeAddMemberModal"  />
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import OrgSidebar from '../components/OrgSidebar.vue'
import AddMemberModal from '../components/modals/AddMemberModal.vue'

export default {
  name: 'my-group',
  components: {
    OrgSidebar,
    AddMemberModal
  },
  data () {
    return {
      error: '',
      selectedUser: '',
      addMemberModal: {
        opened: false,
      },
      removingMember: false,
      removingGroup: false,
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
    groups () {
      return this.$store.state.org.groups
    },
    groupName () {
      return this.$route.params.groupName
    },
    groupUsers () {
      if (!this.usersMap || !this.groups) {
        return []
      }
      var group = this.groups.find(g => g.group == this.groupName)
      return group.users.map(u => this.usersMap[u])
    },
    canRemoveMember () {
      var group = this.groups.find(g => g.group == this.groupName)
      if (group.users.length <= 1) {
        return false
      }
      return group.users.includes(this.selectedUser)
    },
    usernamesToAdd () {
      if (!this.usersMap || !this.groups) {
        return []
      }
      var group = this.groups.find(g => g.group == this.groupName)
      var allUsernames = Object.keys(this.usersMap)
      var usernamesToAdd = []
      for (var username of allUsernames) {
        if (!group.users.includes(username)) {
          usernamesToAdd.push(username)
        }
      }
      usernamesToAdd.sort()
      return usernamesToAdd
    },
  },
  methods: {
    closeAddMemberModal (result) {
      if (result) {
        this.getGroups()
        this.selectedUser = result
      }
      this.addMemberModal.opened = false
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
    removeMember () {
      if (!this.selectedUser) {
        return
      }
      var confirm = {
        title: 'Remove member',
        message: 'Are you sure to remove "' + this.selectedUser + '" from group "' + this.groupName + '"?',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.removeMemberConfirmed,
          args: []
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    removeMemberConfirmed () {
      var message = {
        username: this.myUsername,
        token: this.token,
        actionUsername: this.selectedUser,
        group: this.groupName,
      }
      this.removingMember = true
      this.$http.post(this.server + '/myapp/remove-user-from-group/', message).then(resp => {
        this.getGroups()
        this.error = ''
        this.removingMember = false
      }, err => {
        this.error = err.body
        this.removingMember = false
      })
    },
    removeGroup () {
      var confirm = {
        title: 'Remove group',
        message: 'Are you sure to remove this group "' + this.groupName + '"?',
        button: 'Yes, I am sure.',
        callback: {
          context: this,
          method: this.removeGroupConfirmed,
          args: []
        }
      }
      this.$store.commit('modals/openConfirmModal', confirm)
    },
    removeGroupConfirmed () {
      var message = {
        username: this.myUsername,
        token: this.token,
        group: this.groupName,
      }
      this.removingGroup = true
      this.$http.post(this.server + '/myapp/remove-group/', message).then(resp => {
        this.getGroups()
        this.error = ''
        this.removingGroup = false
        this.$router.push('/groups')
      }, err => {
        this.error = err.body
        this.removingGroup = false
      })
    },
  },
  mounted () {
    
  },
}
</script>

<style scoped>

</style>
