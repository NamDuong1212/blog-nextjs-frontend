"use client";

import React, { useState, useEffect } from "react";
import Input from "./Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = state;

    if (!email || !password) {
      toast.error("All fields are required", { autoClose: 2000 });
      return;
    }

    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    let hasError = false;

    if (!pattern.test(email)) {
      toast.error("Please enter a valid email address.", { autoClose: 2000 });
      hasError = true;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.", { autoClose: 2000 });
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid Credentials", { autoClose: 2000 });
        setIsLoading(false);
        return;
      }

      
      setTimeout(() => {
        toast.success("Login Successful", { autoClose: 2000 });

        setTimeout(() => {
          router.push("/");
        }, 2000); 
      }, 0); 
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred", { autoClose: 2000 });
    }

    setIsLoading(false);
  };

  return (
    <section className="container">
      <form
        onSubmit={handleSubmit}
        className="border-2 border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5"
      >
        <h2 className="text-center special-word">Login</h2>

        <Input
          label="Email"
          type="text"
          name="email"
          onChange={handleChange}
          value={state.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={state.password}
        />

        <button type="submit" className="btn w-full">
          {isLoading ? "Loading..." : "Login"}
        </button>

        <p className="text-center">
          Need an account?{" "}
          <Link href={"/signup"} className="text-primaryColor">
            Sign Up
          </Link>
        </p>
      </form>

      <ToastContainer />
    </section>
  );
};

export default LoginForm;
