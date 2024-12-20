import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvpuCQskOZZTHiK3p8IDjioBjSYyPYZQ8",
  authDomain: "maid-security-e7d05.firebaseapp.com",
  projectId: "maid-security-e7d05",
  storageBucket: "maid-security-e7d05.appspot.com",
  messagingSenderId: "624698810794",
  appId: "1:624698810794:web:5b818fe295968a6a9c8bd3",
  measurementId: "G-NT0HPXFZ82",
  databaseUrl: "https://maid-security-e7d05-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// export default app;

export { app, auth };
