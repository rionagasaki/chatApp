<template>
    <v-app>
    <v-card width="400px" class="mx-auto mt-5" >
     <v-card-title>
       <h3>The Chat!</h3>
     </v-card-title>
     <v-card-text>
       <v-form>
         <v-text-field label="ユーザー名" prepend-icon="mdi-account-circle" v-model="name"></v-text-field>
         <v-text-field label="メールアドレス" prepend-icon="mdi-email" v-model="email" type="email"></v-text-field>
         <v-text-field label="パスワード" prepend-icon="mdi-lock" append-icon="mdi-eye-off" type="password" v-model="password"></v-text-field>
         
       </v-form>
       <v-checkbox label="アカウント新規作成" color="orange" v-model="checked" @click="change"></v-checkbox>
       <v-alert
       type="error" v-if="loginFall"
       >有効なアカウントが見つかりません。</v-alert>
       <v-alert type="error" v-if="createFall">
         全ての入力欄に記入してください。
       </v-alert>
       <v-alert type="error" v-if="imageFall">
         アイコンの画像を設定してください。
       </v-alert>
       
       <v-card-text v-if="checked" class="mt-n5">アイコンを設定</v-card-text>
        <v-avatar
            class="mx-auto d-block"
            color="grey"
            size="70"
            v-if="checked"
            > 
            <v-img :src="imageData" v-if="imageData"></v-img>
          </v-avatar>
        <v-col cols="10" class="mx-auto">
          <v-file-input
           @change="getFile($event)"
           v-if="checked"
           accept="image/png, image/jpeg, image/bmp"
           placeholder="Pick an avatar"
           prepend-icon="mdi-camera"
           label="Avatar"
          ></v-file-input>
          </v-col>
       <v-spacer></v-spacer>
       <v-btn color="orange" dark class="mx-auto d-block mt-0" v-if="checked" @click="register1">アカウント作成</v-btn>
        <v-btn color="orange" dark class="mx-auto d-block " @click="logined" v-else>Log In</v-btn>
     </v-card-text>
    </v-card>
    </v-app>
</template>

<script>
import { getFirestore ,collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { mapActions } from "vuex"

export default {
  layout:'login',
  asyncData({route}){
    console.log(route.name)
  },
  data(){
    return{
      checked: false,
      value: 0,
      name:"",
      password:"",
      email:"",
      imageData: '',
      loginFall: false,
      createFall: false,
      imageFall: false,
    }
  },

  
  created(){

    const auth = getAuth()
    onAuthStateChanged(auth, user=>{
      if (user){
        this.$router.push('/home')
      }
    })
  },
  methods:{
    change(){
      this.loginFall = false
      this.createFall = false
    },

     getFile(file) {
      
     if (file !== undefined && file !== null) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          this.imageData = fr.result
        })
      } else {
        this.imageData = ''
      }
    },
    async register1(){
      try{
      const image = this.imageData;
      const db = getFirestore()
      if (this.name === '' || this.password === '' || this.email === ''){
        this.createFall = true
        return
      }
      if (image === ''){
        this.imageFall = true;
        return
      }
      const docRef = await addDoc(collection(db, "users"), {
      name: this.name,
      password: this.password,
      email: this.email,
      avatar:  image
      });
      console.log("Document written with ID: ", docRef.id);
      const userData = {
        name: this.name,
        password: this.password,
        email: this.email,
        avatar: image
      }
      await this.register(userData)
      this.$router.push('/home')
      }catch(e){
        console.error(e)
      }
    },

   async logined(){
     if(this.name === '' || this.password === '' || this.email === ''){
        this.loginFall = false
        this.createFall = true
        return
      }

     try{
       const userData = {
         name: this.name,
         pass: this.password,
         email: this.email,
       }
       
       await this.$store.dispatch('login', userData)
       this.$router.push('/home')
     }catch(e){
       console.error(e)
       this.createFall = false
       this.loginFall = true;
     }
     
    },
    ...mapActions(['login']),
    ...mapActions(['register'])
  }

}
</script>

<style>

</style>