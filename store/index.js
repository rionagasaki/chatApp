import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth'

export const state = () =>({
   user: null,
   uid: null,
   email: null,
   isLogged: false,
   avatar: '',
   name:''
})

export const getters = {
    user: (state) => state.isLogged,
    avatar: (state)=> state.avatar,
    email:(state)=> state.email,
    name:(state)=> state.name

}

export const mutations = {

    setLoginState(state){
       state.isLogged = true
    },

    setUid(state, uid){
       state.uid = uid
    },

    setEmail(state, email){
        state.email = email
    },

    setAvatar(state, avatar){
        state.avatar = avatar
    },

    setName(state, name){
        state.name = name
    }

}

export const actions = {

//  new account register
    async register({commit},payload){
        const auth = getAuth()
        console.log(payload.email, payload.password)
        await createUserWithEmailAndPassword(auth, payload.email, payload.password)
        .then((userCredential)=>{
        console.log(payload.avatar);
        commit('setLoginState'),
        commit('setUid', userCredential.user.uid),
        commit('setEmail', userCredential.user.email)
        commit('setAvatar', payload.avatar)
        commit('setName', payload.name)
        
        }).catch((e)=>{
            console.error(e)
        })
        
    },

// user login
    async login({commit}, payload){
        console.log("map");
        const db = getFirestore()
        const q = query(collection(db, "users"), where("name", "==", payload.name), where("password", "==", payload.password), where("email", "==", payload.email))
       const querySnapshot = await getDocs(q);
       if (querySnapshot.docs.length === 0){
           this.loginFall = true
           return
       }
       querySnapshot.forEach(async (doc) => {
        
        const auth = getAuth()
        
    await signInWithEmailAndPassword(auth, doc.data().email, doc.data().password)
    .then((userCredential)=>{
            commit('setLoginState', true),
            commit('setUid', userCredential.user.uid),
            commit('setEmail', userCredential.user.email)
            commit('setAvatar', payload.avatar)
            commit('setName', payload.name)
           
       }).catch((e)=>{
          console.error(e);
       })
        
       
  });
   },
}