/**
 * Firebase Configuration - Transurfing LLC
 * Configuración para Firestore Database y Hosting
 */

// Configuración de Firebase (reemplazar con tus credenciales reales)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "transurfing-llc.firebaseapp.com",
    projectId: "transurfing-llc",
    storageBucket: "transurfing-llc.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
};

// Import Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// ============================================
// GUARDAR CONTACTO EN FIRESTORE
// ============================================
async function saveContactToFirebase(contactData) {
    try {
        const docRef = await addDoc(collection(db, 'contacts'), {
            ...contactData,
            createdAt: serverTimestamp(),
            status: 'new',
            source: 'landing_page'
        });
        console.log('Contacto guardado con ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error guardando contacto:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// OBTENER TODOS LOS CONTACTOS
// ============================================
async function getAllContacts() {
    try {
        const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const contacts = [];
        querySnapshot.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, contacts };
    } catch (error) {
        console.error('Error obteniendo contactos:', error);
        return { success: false, error: error.message };
    }
}

// Exportar funciones
export { app, db, analytics, saveContactToFirebase, getAllContacts };
