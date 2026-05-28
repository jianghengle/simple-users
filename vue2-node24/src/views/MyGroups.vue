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
                <div class="mb-6">
                  <span class="is-pulled-right">
                    <div class="buttons">
                      <button class="button is-link" v-if="myRole == 'owner' || myRole == 'admin'" @click="addGroupModal.opened = true">Add group</button>
                    </div>
                  </span>
                  
                  <h4 class="title is-4">
                    <span>Groups</span>&nbsp;
                    <span class="is-size-5 has-text-grey has-text-weight-normal">({{ groups.length }})</span>
                  </h4>
                </div>
                <table class="table is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Group name</th>
                      <th>Email</th>
                      <th>Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(g, i) in groups">
                      <td>{{ i + 1 }}</td>
                      <td><router-link :to="'/group/' + g.group">{{ g.group }}</router-link></td>
                      <td><span class="tag">{{ g.group + '@' + domain }}</span></td>
                      <td>{{ g.users.length }}</td>
                    </tr>
                  </tbody>
                </table>
                
              </div>
            </div>
          </section>
        </div>
      </div>
      <add-group-modal :opened="addGroupModal.opened" :groups="groups" :usernames="usernames" @closeAddGroupModal="closeAddGroupModal" />
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import OrgSidebar from '../components/OrgSidebar.vue'
import AddGroupModal from '../components/modals/AddGroupModal.vue'

export default {
  name: 'my-groups',
  components: {
    OrgSidebar,
    AddGroupModal
  },
  data () {
    return {
      error: '',
      addGroupModal: {
        opened: false,
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
    groups () {
      return this.$store.state.org.groups
    },
    usersMap () {
      return this.$store.state.org.usersMap
    },
    usernames () {
      if (!this.usersMap) {
        return []
      }
      var usernames = Object.keys(this.usersMap)
      usernames.sort()
      return usernames
    },
  },
  methods: {
    closeAddGroupModal (result) {
      if (result) {
        this.getGroups()
      }
      this.addGroupModal.opened = false
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
  },
}
</script>

<style scoped>
</style>
