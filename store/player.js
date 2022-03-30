export const state = () => ({
  // 專輯
  album: null,
  // 播放清單
  list: [],
  // 目前播放
  current: null,
  // Loop
  loop: false,
})

export const actions = {
  play({ commit }, payload) {
    commit('setState', payload)
  },
  prev({ commit }) {
    commit('prev')
  },
  next({ commit }) {
    commit('next')
  },
  loop({ commit }) {
    commit('loop')
  },
}

export const mutations = {
  setState(state, payload) {
    state.album = payload.album

    state.list = payload.album.list.length > 0 ? payload.album.list : []

    state.current =
      state.list.find((item) => {
        return item.id === payload.id
      }) || state.list[0] || null
  },
  prev(state) {
    const index = state.list.findIndex((item) => {
      return item.id === state.current.id
    })

    if (index !== -1) {
      if (state.loop === true) {
        state.current =
          state.list[
            Math.max(index === 0 ? state.list.length - 1 : index - 1, 0)
          ]
      } else {
        state.current = state.list[Math.max(index - 1, 0)]
      }
    }
  },
  next(state) {
    const index = state.list.findIndex((item) => {
      return item.id === state.current.id
    })

    if (index !== -1) {
      if (state.loop === true) {
        state.current =
          state.list[
            Math.min(
              index + 1 === state.list.length ? 0 : index + 1,
              state.list.length - 1
            )
          ]
      } else {
        state.current = state.list[Math.min(index + 1, state.list.length - 1)]
      }
    }
  },
  loop(state) {
    state.loop = !state.loop
  },
}
