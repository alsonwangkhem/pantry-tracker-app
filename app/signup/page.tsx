"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, InputAdornment, InputLabel, Paper, Typography } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import GoogleIcon from '@mui/icons-material/Google';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignup = () => {
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    setError("");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setEmail("");
        setPassword("");
        setLoading(false);
        
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
      router.push('/dashboard');
  };


  return (
    <div className="h-screen flex justify-center items-center">
      <Paper elevation={24} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, width: '100%' }}>
        <InputLabel htmlFor="email-input">Email</InputLabel>
        <Input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
          aria-describedby="email-helper-text"
        />
        <InputLabel htmlFor="password-input">Password</InputLabel>
        <Input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <KeyIcon />
            </InputAdornment>
          }
          aria-describedby="password-helper-text"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button 
          variant="contained" 
          onClick={handleSignup} 
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>
        
        <Button onClick={() => router.push('/signin')}>Already have an account? Login</Button>
      </Paper>
    </div>
  );
}

export default Signup;
