import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../axios-auth';
import router from '../router';
import axiosRefresh from '../axios-refresh';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        idToken: null
    },
    mutations : {
        updateIdToken(state, idToken) {
            state.idToken = idToken
        }
    },
    getters: {
        idToken: state => state.idToken
    },
    actions: {
        autoLogin({ commit }) {
            const idToken = localStorage.getItem('idToken');
            if (!idToken) return;
            const now = new Date();
            const expiryTimeMs = localStorage.getItem('expiryTimeMs');
            const isExpired = now.getTime() >= expiryTimeMs;
            const refreshToken = localStorage.getItem('refreshToken');
            if (isExpired) {
                dispatch('refreshIdToken', refreshToken);
            } else {
                const expiresInMs = expiryTimeMs - now.getTime();
                setTimeout(() => {
                    dispatch('refreshIdToken', refreshToken);
                }, expiresInMs);
                commit('updateIdToken', idToken);
            }
        },
        login({ dispatch }, authData) {
            axios.post('/accounts:signInWithPassword?key=AIzaSyDLSK9NIKJLvpSGlkUW6pvTs6WN9efzSHM',
            {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            }).then(response => {
              dispatch('setAuthData', {
                  idToken: response.data.idToken,
                  expiresIn: response.data.expiresIn,
                  refreshToken: response.data.refreshToken,
              });
                router.push('/');
            });
        },
        logout({ commit }) {
            commit('updateIdToken', null);
            localStorage.removeItem('idToken');
            localStorage.removeItem('expiryTimeMs');
            localStorage.removeItem('refreshIdToken');
            localStorage.removeItem('refreshToken');
            router.replace('/login')

        },
        refreshIdToken({ dispatch }, refreshIdToken) {
            axiosRefresh.post('/token?key=AIzaSyDLSK9NIKJLvpSGlkUW6pvTs6WN9efzSHM', {
                grant_type: 'refresh_token',
                refresh_token: response.data.refreshToken
            }).then(response => {
                dispatch('setAuthData', {
                    idToken: respons.data.id_idtoken,
                    expiresIn: response.data.expires_in,
                    refreshIdToken: response.data.refresh_id_token,
                });
            });
        },
        register({dispatch}, authData) {
            axios.post('/accounts:signUp?key=AIzaSyDLSK9NIKJLvpSGlkUW6pvTs6WN9efzSHM',
            {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            }).then(response => {
                dispatch('setAuthData', {
                    idToken: response.data.idToken,
                    expiresIn: response.data.expiresIn,
                    refreshIdToken: response.data.refreshIdToken,
                });
                router.push('/')
            }).catch(error => {
                console.log(error.response.data.error);
            });
        },
        setAuthData({ commit, dispatch }, authData) {
            const now = new Date();
            const expiryTimeMs = now.getTime() + authData.expiresIn * 1000;
            commit('updateIdToken', authData.idToken);
            localStorage.setItem('idToken', authData.idToken);
            localStorage.setItem('expiryTimeMs', expiryTimeMs);
            localStorage.setItem('refreshToken', authData.refreshToken);
            setTimeout(() => {
                dispatch('refreshIdToken', authData.refreshToken);
            }, authData.expiresIn * 1000);
        }
    }
});