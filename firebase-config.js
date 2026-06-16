// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBb7rL0fM_iX3bzsqZF1KZ-uc4nV-X2N9I",
    authDomain: "prime-portal-27b1d.firebaseapp.com",
    projectId: "prime-portal-27b1d",
    storageBucket: "prime-portal-27b1d.firebasestorage.app",
    messagingSenderId: "569175351808",
    appId: "1:569175351808:web:1ff199dcdcdb693fac6ee5",
    measurementId: "G-83XET5YB2J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Pushes all current localStorage datasets up to the Firestore Cloud
 */
export async function uploadAllToCloud() {
    const masterPayload = {
        adminData: localStorage.getItem('adminData') || "[]",
        staffData: localStorage.getItem('staffData') || "[]",
        studentData: localStorage.getItem('studentData') || "[]",
        noticeData: localStorage.getItem('noticeData') || "[]",
        hwRecords: localStorage.getItem('hwRecords') || "[]",
        cwRecords: localStorage.getItem('cwRecords') || "[]",
        reportRecords: localStorage.getItem('reportRecords') || "[]",
        attendanceRecords: localStorage.getItem('attendanceRecords') || "[]",
        messageData: localStorage.getItem('messageData') || "[]",
        systemTheme: localStorage.getItem('systemTheme') || "blue"
    };
    
    try {
        await setDoc(doc(db, "portal_data", "classroom_master"), masterPayload);
        console.log("☁️ Cloud Database sync complete!");
    } catch (error) {
        console.error("❌ Error uploading to Firestore:", error);
    }
}

/**
 * Pulls the latest cloud data down and overwrites browser localStorage
 */
export async function pullFromCloudToLocal() {
    try {
        const docRef = doc(db, "portal_data", "classroom_master");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key]);
            });
            console.log("🔄 Local storage synchronized with cloud state.");
            return true;
        }
        return false;
    } catch (error) {
        console.error("❌ Error pulling from Firestore:", error);
        return false;
    }
}
