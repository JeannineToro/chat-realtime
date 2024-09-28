const nombreUsuario = document.getElementById("nombre-usuario");
const botones = document.querySelector(".botones");
const contenido = document.querySelector(".contenido");
const formulario = document.getElementById("formulario");
const input = document.getElementById("input-chat");

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC4MQhHI-fZTawpgx8JIYFCPbKwklpd1c4",
    authDomain: "chat-95ff4.firebaseapp.com",
    projectId: "chat-95ff4",
    storageBucket: "chat-95ff4.appspot.com",
    messagingSenderId: "996586785819",
    appId: "1:996586785819:web:6bcfe4f783bb74862cbcbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
if (user) {
    console.log(user);
    botones.innerHTML = /*html*/`
        <button class="cerrar-sesion">Cerrar Sesión</button>
    `;

    cerrarSesion();

    nombreUsuario.innerHTML = user.displayName;
    formulario.classList.remove("form-oculto");
    contenidoChat(user);
} else {
    console.log("Usuario no existe");
    botones.innerHTML = /*html*/ ` 
        <button class="acceder">Acceder</button>
    `;
    contenido.innerHTML = /*html*/ `
        <p>Debes iniciar sesión</p>
    `;

    iniciarSesion();

    nombreUsuario.innerHTML = "Chat";
    formulario.classList.add("form-oculto");
}
});

const contenidoChat = (user)=>{

    formulario.addEventListener("submit", (e)=>{
        e.preventDefault();
        console.log("Procesando formulario");
        if(!input.value.trim()){
            console.log("Input vacío");
            return;
        }

        const docRef = addDoc(collection(db, "chat"), {
            texto: input.value,
            uid: user.uid,
            fecha: Date.now()
        })
            .then(res => console.log("Mensaje guardado"))
            .catch(e => console.log(e));

        input.value = "";
    })

    const q = query(collection(db, "chat"), orderBy("fecha"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {

        contenido.innerHTML = "";

        querySnapshot.forEach(doc => {
            if(doc.data().uid === user.uid){
                contenido.innerHTML += /*html*/ `
                    <div class="msj-enviado">
                        <span>${doc.data().texto}</span>
                    </div>
                `;
            }else{
                contenido.innerHTML += /*html*/ `
                    <div class="msj-entrante">
                        <span>${doc.data().texto}</span>
                    </div>
                `;
            }

            contenido.scrollTop = contenido.scrollHeight;
        });
    });
}

const cerrarSesion = ()=>{
    const btnCerrar = document.querySelector(".cerrar-sesion");
    btnCerrar.addEventListener("click", ()=>{
        signOut(auth);
    })
}

const iniciarSesion = ()=>{
    const btnAcceder = document.querySelector(".acceder");

    btnAcceder.addEventListener("click", async ()=>{
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.log(error);
        }
    })
}