import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../../firebase";

const Following = () => {
  const [userDetail, setUserDetail] = useOutletContext();
  const [followingData, setFollowingData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchFollowing = await Promise.all(
          userDetail.followings.map(async (userid) => {
            const q = query(
              collection(db, "users"),
              where("uid", "==", userid)
            );
            const querySnapshot = await getDocs(q);

            const userDataPromises = querySnapshot.docs.map(async (udoc) => {
              const userDocRef = doc(db, "users", udoc.id);
              const userDocSnapshot = await getDoc(userDocRef);
              const { image, uid, username, followings } =
                userDocSnapshot.data();
              return { image, uid, username, followCount: followings.length };
            });

            return Promise.all(userDataPromises);
          })
        );

        const allFollowingData = fetchFollowing.flat();
        console.log(allFollowingData);
        setFollowingData(allFollowingData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching following data:", error);
        alert("Something went wrong while fetching the data");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div class="rounded-md p-4 max-w-md w-full mx-auto my-4">
          <div class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-slate-300 h-10 w-10"></div>
            <div class="flex-1 space-y-6 py-1">
              <div class="h-2 bg-slate-300 rounded"></div>
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-2 bg-slate-300 rounded col-span-2"></div>
                  <div class="h-2 bg-slate-300 rounded col-span-1"></div>
                </div>
                <div class="h-2 bg-slate-300 rounded"></div>
                <div class="h-2 bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (followingData.length === 0) {
    // No elements exist case
    return (
      <div>
        <p>No following users found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="following-page">
        {followingData.map((user, ind) => (
          <div
            key={ind}
            className="user-content flex justify-between items-center p-4 mt-8"
          >
            <div className="flex gap-8">
              <div className="user-logo">
                <img
                  src={user.image}
                  alt="userimg"
                  className="w-10 h-10 rounded-full border border-slate-400"
                />
              </div>
              <div className="user-detail">
                <div className="flex flex-col">
                  <p className="text-[1.2rem] font-medium text-slate-700">
                    {user.username}
                  </p>
                  <p className="text-[0.7rem] text-slate-400">
                    Following {user.followCount}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[0.9rem]">Following</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Following;
