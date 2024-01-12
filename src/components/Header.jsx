import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom/dist";
import { useUserContext } from "../context/userContext";

const Header = () => {
  const location = useLocation();
  const { logoutUser, user } = useUserContext();

  return (
    <>
      <div className="header_page">
        <header
          className={`header fixed w-full grid grid-cols-2 items-center ${
            user ? "shadow-md shadow-black/20 z-10 bg-white" : ""
          }`}
        >
          <div className="logo py-4 px-[5rem]">
            <Link
              to={"/feed"}
              className="text-rose-400 font-medium text-[1.5rem]"
            >
              TweetX
            </Link>
          </div>
          {user && (
            <div className="header-content px-8 flex gap-[60px] items-center">
              <ul className="flex items-center font-semibold">
                <Link
                  to={"/feed"}
                  className={`px-8 py-4 ${
                    location.pathname === "/feed"
                      ? "text-rose-400"
                      : "text-slate-300"
                  }`}
                >
                  Feed
                </Link>
                <Link
                  to={"/users"}
                  className={`px-8 py-4 ${
                    location.pathname === "/users"
                      ? "text-rose-400"
                      : "text-slate-300"
                  }`}
                >
                  Users
                </Link>
                <Link
                  to={"/profile"}
                  className={`px-8 py-4 ${
                    location.pathname === "/profile"
                      ? "text-rose-400"
                      : "text-slate-300"
                  }`}
                >
                  Profile
                </Link>
              </ul>
              <button
                className="bg-rose-400 text-white rounded-lg text-base px-6 py-2 h-10 text-[0.9rem] font-medium"
                onClick={() => {
                  logoutUser();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </header>
      </div>
    </>
  );
};

export default Header;
