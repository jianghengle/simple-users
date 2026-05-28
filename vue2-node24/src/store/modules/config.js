const dev = process.env.NODE_ENV == 'development'

// initial state
export const state = {
  server: 'https://mailapp.myworkflowhub.com:444',
  domain: 'myworkflowhub.com',
}

// mutations
export const mutations = {
}

export default {
  namespaced: true,
  state,
  mutations
}
