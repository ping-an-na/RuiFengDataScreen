import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import route from './modules/route'

Vue.use(Vuex)

const state = {}

const mutations = {}

const store = new Vuex.Store({
    state,
    mutations,
    modules: {
        route
    },
    getters
})

export default store
