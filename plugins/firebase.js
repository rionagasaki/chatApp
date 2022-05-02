import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyBFcze2FV9lV9qDC255zAZB8Z-Ayzdf9B4",
    authDomain: "chatapp-358b4.firebaseapp.com",
    projectId: "chatapp-358b4",
    storageBucket: "chatapp-358b4.appspot.com",
    messagingSenderId: "336607482562",
    appId: "1:336607482562:web:31508fbb1645a5bd11615b",
    measurementId: "G-V3CFYCP4FJ"
  };

  const app = initializeApp(firebaseConfig);

  export default(context, inject)=> {
      inject('firebase', app)
  }

  if (process.server){
     console.log('plugins(SSR)', Date.now())
  }else{
     console.log('plugins(CSR)', Date.now())
  }
