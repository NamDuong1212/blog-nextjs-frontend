"use client";

import React, { useEffect, useState } from "react";
import Input from "./Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  name: "",
  email: "",
  password: "",
};

const SignupForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, email, password } = state;
  
    // Kiểm tra nếu tất cả các trường đều trống
    if (!name || !email || !password) {
      toast.error("All fields are required", { autoClose: 2000 });
      return;
    }
  
    // Regular expression pattern for basic email validation
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
  
      const newUser = {
        name,
        email,
        password,
      };
  
      const response = await fetch("http://localhost:3000/api/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(newUser),
      });
  
      if (response?.status === 201) {
        toast.success("Registration Successful", { autoClose: 2000 });
        setTimeout(() => {
          router.push("/login", { scroll: false });
        }, 2000);
      } else {
        toast.error("Error occurred while registering", { autoClose: 2000 });
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred", { autoClose: 2000 });
    }
  
    setIsLoading(false);
  };
  

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  return (
    <section className="container">
      <form
        onSubmit={handleSubmit}
        className="border-2 border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5"
      >
        <h2 className="text-center special-word">Sign up</h2>

        <Input
          label="Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={state.name}
        />
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
          {isLoading ? "Loading..." : "Sign Up"}
        </button>

        <p className="text-center">
          Already a user?{" "}
          <Link href={"/login"} className="text-primaryColor">
            Login
          </Link>
        </p>
      </form>

      {/* Toast container to display notifications */}
      <ToastContainer />
    </section>
  );
};

export default SignupForm;
