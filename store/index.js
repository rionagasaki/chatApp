import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

export const state = () => ({
  uid: null,
  email: null,
  avatar: '',
  name: '',
})

export const getters = {
  avatar: (state) => state.avatar,
  email: (state) => state.email,
  name: (state) => state.name,
}

export const mutations = {
  setUid(state, uid) {
    state.uid = uid
  },

  setEmail(state, email) {
    state.email = email
  },

  setAvatar(state, avatar) {
    state.avatar = avatar
  },

  setName(state, name) {
    state.name = name
  },

  deleteUser(state) {
    ;(state.user = null),
      (state.uid = null),
      (state.email = null),
      (state.isLogged = false),
      (state.avatar = ''),
      (state.name = '')
  },
}

export const actions = {
  //  new account register

  async register({ commit }, payload) {
    const auth = getAuth()
    await createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        commit('setUid', userCredential.user.uid),
          commit('setEmail', userCredential.user.email)
        commit('setAvatar', payload.avatar)
        commit('setName', payload.name)
      })
      .catch((e) => {
        console.error(e)
      })
  },
  async addUser({ commit }, email) {
    console.log(email)
    if (!email) {
      return
    }
    const db = getFirestore()
    const q = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const email = doc.data().email
      const avatar = doc.data().avatar
      const name = doc.data().name
      commit('setEmail', email),
        commit('setAvatar', avatar),
        commit('setName', name)
    })
  },

  // user login
  async login({ commit }, payload) {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, payload.email, payload.pass)
      .then(async (userCredential) => {
        const db = getFirestore()
        const q = query(
          collection(db, 'users'),
          where('name', '==', payload.name),
          where('password', '==', payload.pass),
          where('email', '==', payload.email)
        )
        const querySnapshot = await getDocs(q)
        console.log(`query ${querySnapshot.docs.length}`)
        if (querySnapshot.docs.length === 0) {
          throw new Error('error')
        }
        querySnapshot.forEach((doc) => {
          commit('setUid', userCredential.user.uid),
            commit('setEmail', userCredential.user.email),
            commit('setAvatar', doc.data().avatar),
            commit('setName', doc.data().name)
        })
        // Signed in
      })
      .catch((error) => {
        console.log('error:', error)
        throw new Error('error')
      })
  },
}
