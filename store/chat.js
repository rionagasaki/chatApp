import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { getFirestore, collection, getDocs, where, query, orderBy } from 'firebase/firestore'

export const state = () => ({
    user1: null,
    user2: null,
    users: [],
    chat: [],
    unscribe: null,
    snapshot: null

})

export const getters = {
    user1: (state) => state.user1,
    user2: (state) => state.user2,
    users: (state) => state.users,
    chat: (state) => state.chat
}

export const mutations = {

    addUser(state, data) {
        state.users.push(data)
    },

    userliset(state) {

        state.users.length = 0
    },

    setUser(state, user) { 
        state.user1 = user
    },
    // state.chat配列を空にする。
    deleteChat(state) {
        state.chat.length = 0
    },

    talkuserliset(state) {
        state.user1 = null
    },

    addChat(state, chat) {
        state.chat.push(chat)

    }
}

export const actions = {

    // talkできるユーザー一覧表示
    async addUser({ commit }, email) {
        const db = getFirestore()
        const querySnapshot = await getDocs(collection(db, "users"), where('email', '!=', email));
        querySnapshot.forEach(async (doc) => {
            if (doc.data().email === email) {
                return
            }
            const data = { email: doc.data().email, avatar: doc.data().avatar }
            await commit('addUser', data)
        });
    },

    // chatDisplay.vue/createdで呼ばれる
    // ここはこれまでにされたチャット内容をstate.chat配列にpushしていく。
    fetchChat({ commit }, payload) {

        const auth = getAuth();
        const db = getFirestore();
        onAuthStateChanged(auth, async user => {
            if (user) {

                // payload.user1は今ログインているユーザー、payload.user2はuser1
                const q = query(collection(db, "chat", payload.user1 + payload.user2, "message"), orderBy("sendTime"));
                const querySnapshot = await getDocs(q);
                // chat []
                commit('deleteChat')
                querySnapshot.forEach(async (doc) => {
                    const chatData = {
                        message: doc.data().message,
                        sendUser: doc.data().sendUser
                    }
                    // ここでaddChatを呼び出し、
                    await commit('addChat', chatData)
                });

            } else {
                console.log('no user')
            }
        })
    },

    setUser({ commit }, user) {
        commit('setUser', user);
    },

    
}