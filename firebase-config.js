// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Your exact web app's Firebase configuration from the screenshot
const firebaseConfig = {
    apiKey: "AIzaSyBb7rL0fM_iX3bzsqZF1KZ-uc4nV-X2N9I",
    authDomain: "prime-portal-27b1d.firebaseapp.com",
    projectId: "prime-portal-27b1d",
    storageBucket: "prime-portal-27b1d.firebasestorage.app",
    messagingSenderId: "569175351808",
    appId: "1:569175351808:web:1ff199dcdcdb693fac6ee5",
    measurementId: "G-83XET5YB2J"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Pushes all current localStorage datasets up to the Firestore Cloud
 */
export async function uploadAllToCloud() {
    const masterPayload = {
        adminData: JSON.parse(localStorage.getItem('adminData')) || [],
        staffData: JSON.parse(localStorage.getItem('staffData')) || [],
        studentData: JSON.parse(localStorage.getItem('studentData')) || [],
        noticeData: JSON.parse(localStorage.getItem('noticeData')) || [],
        hwRecords: JSON.parse(localStorage.getItem('hwRecords')) || [],
        cwRecords: JSON.parse(localStorage.getItem('cwRecords')) || [],
        reportRecords: JSON.parse(localStorage.getItem('reportRecords')) || [],
        attendanceRecords: JSON.parse(localStorage.getItem('attendanceRecords')) || [],
        messageData: JSON.parse(localStorage.getItem('messageData')) || []
    };
    
    try {
        // Saves everything into a single master document inside a 'portal_data' collection
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
            // Dynamically rebuild localStorage keys based on cloud values
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, JSON.stringify(data[key]));
            });
            console.log("🔄 Local storage synchronized with cloud state.");
        } else {
            console.log("ℹ️ No remote database document found. Using local baseline data.");
        }
    } catch (error) {
        console.error("❌ Error pulling from Firestore:", error);
    }
}