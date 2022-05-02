

// export default function({ redirect, route, store }){
//    console.log('middleware')
// }
if (process.server){
   console.log('middleware(SSR)', Date.now())
}else{
   console.log('middleware(CSR)', Date.now())
}