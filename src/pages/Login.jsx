import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom/dist";
import IMG from "../assets/brief.png";
import Button from "../components/Button";
import { useUserContext } from "../context/userContext";

const Login = () => {
  const auth = getAuth();
  const { user, updateUser } = useUserContext();

  const [FormData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...FormData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        FormData.email,
        FormData.password
      );

      if (user) {
        const { uid, email, accessToken } = user.user;
        updateUser({ uid, email, accessToken });
        window.location = "/feed";
      }
    } catch (error) {
      console.error(error.message);
      alert("Bad Credential");
    }
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <div className="login-page w-[90%] m-auto py-2 h-full flex justify-center items-center ">
        <div className="login grid grid-cols-2 pt-[10px]">
          <div className="login-content w-[70%] px-3 pt-12">
            <div className="btn pt-12 pb-8">
              <button
                onClick={() => navigate("/signup")}
                className="w-[10rem] border border-black h-[2.5rem] rounded-xl text-[0.8rem] font-medium"
              >
                Create Account
              </button>
            </div>
            <h1 className="text-[2rem] font-semibold pb-8">Login</h1>
            <div className="user-detail">
              <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
                <input
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="p-3 w-full text-[0.9rem] rounded-md bg-slate-100"
                />
                <div className="password relative">
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                    className="p-3 w-full text-[0.9rem] rounded-md bg-slate-100"
                  />
                  <button
                    className="absolute top-1/2 right-2.5 transform -translate-y-1/2"
                    type="button"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
                <div className="forgot-password flex justify-between items-center">
                  <a href="#" className="text-[0.9rem]">
                    Forgot Password ?
                  </a>
                  <Button type="submit">Login</Button>
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

export default Login;
