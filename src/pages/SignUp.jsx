import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import IMG from "../assets/brief.png";
import Button from "../components/Button";
import { db } from "../firebase";

const SignUp = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [FormData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newFormErrors = { ...formErrors };

    // Validate username
    if (FormData.username.trim() === "") {
      newFormErrors.username = "Username is required";
      isValid = false;
    } else {
      newFormErrors.username = "";
    }

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(FormData.email)) {
      newFormErrors.email = "Invalid email address";
      isValid = false;
    } else {
      newFormErrors.email = "";
    }

    // Validate password
    if (FormData.password.length < 6) {
      newFormErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    } else {
      newFormErrors.password = "";
    }

    // Validate confirm password
    if (FormData.confirm_password !== FormData.password) {
      newFormErrors.confirm_password = "Password did not match";
      isValid = false;
    } else {
      newFormErrors.confirm_password = "";
    }

    setFormErrors(newFormErrors);
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...FormData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", FormData.email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.size > 0) {
          console.error("User with this email already exists.");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          FormData.email,
          FormData.password
        );

        const uid = userCredential.user.uid;
        await addDoc(collection(db, "users"), {
          uid,
          username: FormData.username,
          email: FormData.email,
          image: "",
          posts: [],
          followers: [],
          followings: [],
        });
      } catch (error) {
        console.error(error.message);
      }

      setFormData({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      navigate("/login");
    } else {
      console.error("Form validation failed");
    }
  };
  return (
    <>
      <div className="login-page w-[90%] m-auto py-2 h-full flex justify-center items-center ">
        <div className="login grid grid-cols-2 pt-[10px]">
          <div className="login-content w-[70%] px-3 pt-12">
            <div className="btn pt-12">
              <button
                onClick={() => navigate("/login")}
                className="w-[10rem] border border-black h-[2.5rem] rounded-xl text-[0.8rem] font-medium"
              >
                Login
              </button>
            </div>
            <h1 className="text-[2rem] font-semibold py-8">Create Account</h1>
            <div className="user-detail">
              <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
                <div>
                  <input
                    type="text"
                    name="username"
                    value={FormData.username}
                    placeholder="Name"
                    onChange={handleInputChange}
                    className="p-3 w-full text-[0.9rem] rounded-md bg-slate-100"
                  />
                  {formErrors.username && (
                    <span className="text-[0.8rem] text-red-500 px-2">
                      {formErrors.username}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={FormData.email}
                    placeholder="Email"
                    onChange={handleInputChange}
                    className="p-3 w-full text-[0.9rem] rounded-md bg-slate-100"
                  />
                  {formErrors.email && (
                    <span className="text-[0.8rem] text-red-500 px-2">
                      {formErrors.email}
                    </span>
                  )}
                </div>
                <div className="password">
                  <input
                    type="password"
                    name="password"
                    value={FormData.password}
                    placeholder="Password"
                    onChange={handleInputChange}
                    className="p-3 w-full text-[0.9rem] rounded-md bg-slate-100"
                  />
                  <div className="eye"></div>
                  {formErrors.password && (
                    <span className="text-[0.8rem] text-red-500 px-2">
                      {formErrors.password}
                    </span>
                  )}
                </div>
                <div className="confirm password">
                  <input
                    type="password"
                    name="confirm_password"
                    value={FormData.confirm_password}
                    placeholder="Confirm Password"
                    onChange={handleInputChange}
                    className="p-3 w-full text-[0.9rem] rounded-md bg-slate-100"
                  />
                  <div className="eye"></div>
                  {formErrors.confirm_password && (
                    <span className="text-[0.8rem] text-red-500 px-2">
                      {formErrors.confirm_password}
                    </span>
                  )}
                </div>
                <div className="forgot-password flex justify-end">
                  <Button type="submit">Sign Up</Button>
                </div>
              </form>
            </div>
          </div>
          <div className="wallpaper">
            <img src={IMG} alt="loading" className="w-full h-[600px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
