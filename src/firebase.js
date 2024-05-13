// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgwj1IRROxAt8DXC3f5T-5bKwyLl2p1YM",
  authDomain: "barber-app-169e6.firebaseapp.com",
  projectId: "barber-app-169e6",
  storageBucket: "barber-app-169e6.appspot.com",
  messagingSenderId: "214947272707",
  appId: "1:214947272707:web:9b2abe12b7921631fcd636",
  measurementId: "G-D7RKGKKMHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage=getStorage(app)
export{storage,app}