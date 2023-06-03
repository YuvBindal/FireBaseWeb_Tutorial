import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyCpp63MToJmAl9oHIQsgiPSow-BD_6HJDQ",
    authDomain: "fir-9-tut-b0897.firebaseapp.com",
    projectId: "fir-9-tut-b0897",
    storageBucket: "fir-9-tut-b0897.appspot.com",
    messagingSenderId: "614237530239",
    appId: "1:614237530239:web:f2431dbcaa50de5d02b74a"
};
//init firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();

//collection ref
const colRef = collection(db, 'books');
//queries
const q = query(colRef, orderBy('createdAt'));

//real time collection data



const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    });
    console.log(books);
})

//adding/deleting documents
document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.querySelector('.add')
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault()

        addDoc(colRef, {
            title: addBookForm.title.value,
            author: addBookForm.author.value,
            createdAt: serverTimestamp()
        })
            .then(() => {
                addBookForm.reset()
            })


    })


})

document.addEventListener('DOMContentLoaded', () => {
    const deleteBookForm = document.querySelector('.delete')
    deleteBookForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const docRef = doc(db, 'books', deleteBookForm.id.value);
        deleteDoc(docRef).then(() => {
            deleteBookForm.reset()
        })
    })

})

//get a single document
const docRef = doc(db, 'books', '1HptvFUI7ZhmSdkdWx30');


const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
})


//updating a document


document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.querySelector('.update');
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docRef = doc(db, 'books', updateForm.id.value);

        updateDoc(docRef, {
            title: 'updated title',
        })
            .then(() => {
                updateForm.reset();
            })
    })
})

//signing users up

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = signupForm.email.value
        const password = signupForm.password.value
        createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                console.log('user created:', cred.user);
                signupForm.reset();
            })
            .catch((err) => {
                console.log(err.message);
            })

    })
})

//loging users in

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.email.value
        const password = loginForm.password.value
        signInWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                //console.log('user logged in: ', cred.user)
                loginForm.reset();
            })
            .catch((err) => {
                console.log(err.message);
            })
    })

})

//logging users out

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (user) {
            signOut(auth)
                .then(() => {
                    //console.log('The user signed out!');
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } else {
            console.log('No user is currently logged in.');
        }

    })

})

//subscribing to auth changes

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user);
})

//unsubscribing from changes (auth & db)

document.addEventListener('DOMContentLoaded', () => {
    const unsubButton = document.querySelector('.unsub');
    unsubButton.addEventListener('click', ()=> {
        console.log('unsubscribing');

        unsubCol();
        unsubDoc();
        unsubAuth();
    })
})