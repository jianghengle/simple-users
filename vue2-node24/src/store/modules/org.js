// initial state
export const state = {
  usersMap: null,
  groups: null,
}
 
// mutations
export const mutations = {

  setUsersMap (state, users) {
    var usersMap = {}
    for (var u of users) {
      usersMap[u.username] = u
    }
    state.usersMap = usersMap
  },

  setGroups (state, groups) {
    state.groups = groups.filter(g => g.group != 'all')
  },

  reset (state) {
    state.usersMap = null
    state.groups = null
  },
}

export default {
  namespaced: true,
  state,
  mutations
}
