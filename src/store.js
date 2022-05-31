import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            name: '',
            email: '',
            token: '',
            privateKey: '',
            publicKey: '',
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        unsetUser(state) {
            state.user = {
                name: '',
                email: '',
                token: '',
                privateKey: '',
                publicKey: '',
            }
        }
    },
    actions: {
        
    },
})