
import firebase from 'firebase/app'

const firebaseConfig = {
        apiKey: "AIzaSyDDfuETvJlq9cazvkqJS9ZragMVdEh48To",
        authDomain: "tenedores-6505a.firebaseapp.com",
        databaseURL: "https://tenedores-6505a.firebaseio.com",
        projectId: "tenedores-6505a",
        storageBucket: "tenedores-6505a.appspot.com",
        messagingSenderId: "85541133133",
        appId: "1:85541133133:web:fbe4ef0a0379c4ef237504"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig)