import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { TbMessagePlus } from "react-icons/tb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { db } from "../../firebase";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [userDetail, setUserDetail] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (pdoc) => {
          const userDocRef = doc(db, "users", pdoc.id);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();

          setUserDetail(userData);
        });
      } catch (error) {
        alert("Something went wrong while fetching the data");
      }
    }
    fetchData();
  }, []);

  if (!userDetail) return <>Loading</>;

  return (
    <>
      <div className="profile-page lg:w-[40%] md:w-[80%] m-auto pt-[6rem]">
        <div className="flex gap-[4rem]">
          <div className="logo">
            <img
              src=""
              alt="user-logo"
              className="w-[5.5rem] h-[5.5rem] rounded-full border border-slate-400"
            />
          </div>
          <div className="user-detail">
            <div className="flex flex-col mt-3">
              <p className="text-[1.5rem] font-medium text-slate-700 pb-4">
                {userDetail.username}
              </p>
              <div className="account-contents flex gap-10">
                <div className="posts flex gap-2 text-[0.8rem] text-slate-400">
                  <p>Posts : </p>
                  <p>{userDetail.posts.length}</p>
                </div>
                <div className="followers flex gap-2 text-[0.8rem] text-slate-400">
                  <p>Followers : </p>
                  <p>{userDetail.followers.length}</p>
                </div>
                <div className="followings flex gap-2 text-[0.8rem] text-slate-400">
                  <p>Following : </p>
                  <p>{userDetail.followings.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="user-content relative">
          <div className="flex relative justify-around items-center px-4 mt-10 border-t-2 border-slate-300 ml-10 mr-4">
            <div
              className={`posts flex items-center gap-2 text-[0.8rem]  py-3 cursor-pointer ${location.pathname === "/profile"
                ? "text-black"
                : "text-slate-400"
                }`}
              onClick={() => navigate("../profile")}
            >
              <span>
                <TbMessagePlus />
              </span>
              <p>Posts</p>
            </div>
            <div
              className={`followers flex items-center gap-2 text-[0.8rem] cursor-pointer ${location.pathname === "/profile/followers"
                ? "text-black"
                : "text-slate-400"
                }`}
              onClick={() => navigate("../profile/followers")}
            >
              <span>
                <TbMessagePlus />
              </span>
              <p>Followers</p>
            </div>
            <div
              className={`followings flex items-center gap-2 text-[0.8rem] cursor-pointer ${location.pathname === "/profile/following"
                ? "text-black"
                : "text-slate-400"
                }`}
              onClick={() => navigate("../profile/followings")}
            >
              <span>
                <TbMessagePlus />
              </span>
              <p>Following</p>
            </div>
            <div
              className={`absolute top-[-5%] w-[5rem] h-[2.6px] bg-slate-500 
                        ${location.pathname === "/profile"
                  ? "left-[3rem]"
                  : ""
                }
                        ${location.pathname === "/profile/followers"
                  ? "left-[40%]"
                  : ""
                }
                        ${location.pathname === "/profile/followings"
                  ? "left-[73%]"
                  : ""
                }`}
            ></div>
          </div>
        </div>

        <Outlet context={[userDetail, setUserDetail]} />
      </div>
    </>
  );
};

export default Profile;
