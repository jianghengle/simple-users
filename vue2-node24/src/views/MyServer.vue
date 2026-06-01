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
            <div v-if="error" class="notification is-danger is-light">
              <button class="delete" @click="error=''"></button>
              {{error}}
            </div>

            <div class="mb-5">
              <h4 class="title is-4">Mail server settings</h4>
              <h6 class="subtitle is-6">To set up client mail app</h6>
            </div>

            <div class="field">
              <label class="label">Mail host</label>
              <div class="control">
                <input class="input" type="text" readonly :value="mailServer">
              </div>
              <p class="help is-info">For both incoming (IMAP) and outgoing (SMTP)</p>
            </div>

            <div class="field">
              <label class="label">IMAP port (incoming)</label>
              <div class="control">
                <input class="input" type="text" readonly :value="imapPort">
              </div>
              <p class="help is-info">Use TLS/SSL</p>
            </div>
            
            <div class="field">
              <label class="label">SMTP port (outgoing)</label>
              <div class="control">
                <input class="input" type="text" readonly :value="smtpPort">
              </div>
              <p class="help is-info">Use TLS/SSL</p>
            </div>

            <div class="field">
              <label class="label">Authentication</label>
              <div class="control">
                <input class="input" type="text" readonly :value="'Use username (NOT email) and normal password'">
              </div>
            </div>

            <div class="field">
              <label class="label">Certificate</label>
              <div class="control">
                <input class="input" type="text" readonly :value="'Self-signed certificate some apps need advanced settings to unblock'">
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import OrgSidebar from '../components/OrgSidebar.vue'

export default {
  name: 'my-server',
  components: {
    OrgSidebar
  },
  data () {
    return {
      error: '',
    }
  },
  computed: {
    mailServer () {
      return this.$store.state.config.mailServier
    },
    imapPort () {
      return this.$store.state.config.imapPort
    },
    smtpPort () {
      return this.$store.state.config.smtpPort
    },
    token () {
      return this.$store.state.user.token
    },
  },
  methods: {
    
  },
}
</script>

<style scoped>
</style>
