import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/userContext";
import PrivateRoute from "./components/privateRoute";
import Header from "./components/Header";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
const Feed = lazy(() => import("./pages/Feed"));
const Users = lazy(() => import("./pages/Users"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Followers = lazy(() => import("./pages/Profile/Followers"));
const Posts = lazy(() => import("./pages/Profile/Posts"));
const Following = lazy(() => import("./pages/Profile/Following"));

function App() {
  return (
    <>
      <div className="main h-screen">
        <AuthProvider>
          <Header />
        </AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <AuthProvider>
                  <Login />
                </AuthProvider>
              }
            />
            <Route path="/signup" element={<SignUp />} />

            <Route
              path="/feed"
              element={
                <AuthProvider>
                  <PrivateRoute>
                    <Feed />
                  </PrivateRoute>
                </AuthProvider>
              }
            />
            <Route
              path="/users"
              element={
                <AuthProvider>
                  <PrivateRoute>
                    <Users />
                  </PrivateRoute>
                </AuthProvider>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthProvider>
                  <Profile />
                </AuthProvider>
              }
            >
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Posts />
                  </PrivateRoute>
                }
              />
              <Route
                path="followings"
                element={
                  <PrivateRoute>
                    <Following />
                  </PrivateRoute>
                }
              />
              <Route
                path="followers"
                element={
                  <PrivateRoute>
                    <Followers />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
