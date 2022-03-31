<template>
    <v-app>
    <v-card width="400px" class="mx-auto mt-5" >
     <v-card-title>
       <h3>New Application</h3>
     </v-card-title>
     <v-card-text>
       <v-form>
         <v-text-field label="ユーザー名" prepend-icon="mdi-account-circle" v-model="name"></v-text-field>
         <v-text-field label="メールアドレス" prepend-icon="mdi-email" v-model="email" type="email"></v-text-field>
         <v-text-field label="パスワード" prepend-icon="mdi-lock" append-icon="mdi-eye-off" type="password" v-model="password"></v-text-field>
       </v-form>
       <v-checkbox label="アカウント新規作成" color="orange" v-model="checked"></v-checkbox>
       <v-alert
       type="error" v-if="loginFall"
       >有効なアカウントが見つかりません。</v-alert>
       
       <v-card-text v-if="checked" class="mt-n5">アバターを選択</v-card-text>
       <div class="d-flex">
       <div v-for="avatar in avators" :key="avatar.key">
        <v-btn
            icon
            class="ml-7"
            v-if="checked">
            <v-avatar
              color="brown"
              size="48"
            >
            <img  :src="avatar.key">
            </v-avatar>
        </v-btn>
       </div>
       </div>
       <div class="ml-9 mt-5" >
        <v-radio-group v-model="value" class="ml-n4 mt-n2" v-if="checked" row>
    <v-radio
      v-for="n in 5"
      color="indigo"
      v-bind:key="n"
      v-bind:value="n"
      class="ml-4"
    ></v-radio>
  </v-radio-group>
        </div>
       <v-spacer></v-spacer>
       <v-btn color="orange" dark class="mx-auto d-block mt-0" v-if="checked" @click="register1">アカウント作成</v-btn>
        <v-btn color="orange" dark class="mx-auto d-block " @click="logined" v-else>Log In</v-btn>
       
     </v-card-text>
     
    </v-card>
   
    </v-app>
</template>

<script>
import { getFirestore ,collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { mapActions } from "vuex"

export default {
  layout:'login',

  data(){
    return{
      checked: false,
      value: 0,
      name:"",
      password:"",
      email:"",
      loginFall: false,
      avators:[
        {key :'https://m-s-y.com/wp-content/uploads/2018/11/kouunji.png'},
        {key:'https://m-s-y.com/wp-content/uploads/2018/11/ishi.png'},
        {key:'https://m-s-y.com/wp-content/uploads/2018/11/dorobou.png'},
        {key: 'https://img.gamewith.jp/article_tools/daigojinkaku/gacha/s17_ci.png'},
        {key: 'https://img.gamewith.jp/article_tools/daigojinkaku/gacha/s9_ci.png'}
      ]
    }
  },
  methods:{
    async register1(){
      try{
      console.log('ok');
      let image = ''
      const db = getFirestore()
      if (this.value === 1){
         image = 'https://m-s-y.com/wp-content/uploads/2018/11/kouunji.png'
      } else if(this.value === 2){
         image = 'https://m-s-y.com/wp-content/uploads/2018/11/ishi.png'
      } else if(this.value === 3){
         image = 'https://m-s-y.com/wp-content/uploads/2018/11/dorobou.png'
      } else if(this.value === 4){
         image = 'https://img.gamewith.jp/article_tools/daigojinkaku/gacha/s17_ci.png'
      } else{
         image = 'https://img.gamewith.jp/article_tools/daigojinkaku/gacha/s9_ci.png'
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
     try{
     const db = getFirestore()
        const q = query(collection(db, "users"), where("name", "==", this.name), where("password", "==", this.password), where("email", "==", this.email))
       const querySnapshot = await getDocs(q);
       if (querySnapshot.docs.length === 0){
           this.loginFall = true
           return
       }
       querySnapshot.forEach(async(doc) => {
         
         const userData = {
        name: doc.data().name,
        password: doc.data().password,
        email: doc.data().email,
        avatar: doc.data().avatar
      }
       await this.login(userData)
       console.log(doc.id, " => ", doc.data());
       this.$router.push('/home')
       });
     }catch(e){
       console.error(e)
     }
     
    },

    ...mapActions(['login']),
    ...mapActions(['register'])
  }

}
</script>

<style>

</style>