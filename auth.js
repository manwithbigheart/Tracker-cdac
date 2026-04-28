import { firebaseConfig } from './config.js';
import { appState, defaultSyllabus } from './state.js';
import { renderAll } from './ui.js';

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth(firebaseApp);
export const db = firebase.firestore(firebaseApp);
export const provider = new firebase.auth.GoogleAuthProvider();

export function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

export let currentUid = null;
export let currentSessionId = Date.now().toString();

export function signIn() {
    auth.signInWithPopup(provider).catch(e => {
        document.getElementById('auth-error').innerText = e.message;
        document.getElementById('auth-error').classList.remove('hidden');
    });
}

export function signOut() {
    auth.signOut().then(() => location.reload());
}

export function initAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUid = user.uid;
            document.getElementById('auth-overlay').classList.add('hidden');
            document.getElementById('user-photo').src = user.photoURL;
            document.getElementById('user-photo').classList.remove('hidden');
            document.getElementById('user-name').innerText = user.displayName;
            db.collection('users').doc(user.uid).set({ activeSessionId: currentSessionId }, { merge: true });
            initUserData(user);
            requestNotificationPermission();
        }
    });
}

async function initUserData(user) {
    db.collection('users').doc(user.uid).onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            if (data.activeSessionId && data.activeSessionId !== currentSessionId) {
                document.getElementById('session-lock').classList.remove('hidden');
                return;
            }
            if (data.appState) {
                appState = data.appState;
                if (!appState.syllabus) appState.syllabus = JSON.parse(JSON.stringify(defaultSyllabus));
                renderAll();
            }
        } else {
            saveToCloud();
        }
    });
}

export function saveToCloud() {
    if (currentUid) db.collection('users').doc(currentUid).set({ appState, activeSessionId: currentSessionId }, { merge: true });
}