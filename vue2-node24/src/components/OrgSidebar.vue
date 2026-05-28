<template>
  <div>
    <section class="section">
      <aside class="menu">
        <div v-if="!groups">
          <span class="icon is-medium is-size-4">
            <i class="fas fa-spinner fa-pulse"></i>
          </span>
        </div>
        <p class="menu-label">Organization</p>
        <ul v-if="groups" class="menu-list">
            <li>
              <router-link :class="{'is-active': routerPath == '/'}" :to="'/'">Users</router-link>
            </li>
            <li>
              <router-link :class="{'is-active': routerPath == '/groups'}" :to="'/groups'">Groups</router-link>
              <ul>
                <li v-for="(g, i) in groups">
                  <router-link :class="{'is-active': groupName == g.group}" :to="'/group/' + g.group">{{g.group}}</router-link>
                </li>
              </ul>
            </li>
        </ul>
      </aside>
    </section>
    
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'org-sidebar',
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
    groupName () {
      return this.$route.params.groupName
    },
    groups () {
      return this.$store.state.org.groups
    },
  },
  methods: {

  },
  mounted () {

  }
}
</script>