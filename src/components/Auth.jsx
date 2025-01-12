import React, { useState } from "react";
import { auth, db, storage } from "../Firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider 
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(userRef);

      if (!docSnapshot.exists()) {
        await setDoc(userRef, {
          username: user.displayName || user.email,
          photoURL: user.photoURL,
          email: user.email,
        });
      }

      navigate("/chat");
    } catch (error) {
      console.error("Error with Google login:", error);
      setErrorMessage(error.message);
    }
  };

  // Handle file input for signup
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Handle user signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = "";
      if (image) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            reject,
            async () => {
              photoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });

        await updateProfile(user, { displayName: username, photoURL });
      } else {
        photoURL = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        await updateProfile(user, { displayName: username, photoURL });
      }

      await setDoc(doc(db, "users", user.uid), {
        username,
        photoURL,
        email,
      });

      navigate("/chat");
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chat");
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          {isSignUp ? "Create Account" : "Log In"}
        </h1>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 hover:border-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 hover:border-blue-400 transition"
            required
          />
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 hover:border-blue-400 transition"
                required
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              />
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 mb-4 bg-blue-500 text-white rounded-lg font-semibold disabled:bg-gray-300 hover:bg-blue-600 transition"
          >
            {loading ? (isSignUp ? "Creating..." : "Logging in...") : isSignUp ? "Sign Up" : "Log In"}
          </button>
          {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full p-3 mb-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Sign In with Google
        </button>

        <p className="text-sm text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
