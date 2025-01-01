import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-auth-domain.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "storage-bucket",
  messagingSenderId: "messaging-sender-id",
  appId: "your-app-id",
  measurementId: "measurement-id",
  databaseUrl: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// export default app;

export { app, auth };
