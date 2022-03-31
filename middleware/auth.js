import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default function({ redirect, store }){
const auth = getAuth()
console.log(store.getters.user)
onAuthStateChanged(auth, (user)=>{
    if (user){
        
        console.log('signIn状態にあります');
        redirect('/home')
    }
})
}





