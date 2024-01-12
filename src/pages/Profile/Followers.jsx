import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "../../components/Button";
import { db } from "../../firebase";

const Followers = () => {
  const [userDetail, setUserDetail] = useOutletContext();
  const [follwerData, setFollowerData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchFollower = await Promise.all(
          userDetail.followers.map(async (userid) => {
            const q = query(
              collection(db, "users"),
              where("uid", "==", userid)
            );
            const querySnapshot = await getDocs(q);

            const response = querySnapshot.docs.map(async (udoc) => {
              const userDocRef = doc(db, "users", udoc.id);
              const userDocSnapshot = await getDoc(userDocRef);
              const { image, uid, username, followings, followers } =
                userDocSnapshot.data();

              const isFollow = followers.includes(userDetail.uid);
              return {
                image,
                uid,
                username,
                isFollow,
                followCount: followings.length,
              };
            });

            const data = await Promise.all(response);
            return data;
          })
        );

        const allFollowerData = fetchFollower.flat();
        console.log(allFollowerData);
        setFollowerData(allFollowerData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching follower data:", error);
        alert("Something went wrong while fetching the data");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleFollow(ind, userid) {
    const filteredUser = follwerData.filter((_, index) => ind !== index);
    setFollowerData(filteredUser);
    try {
      const query2 = query(
        collection(db, "users"),
        where("uid", "==", userDetail.uid)
      );
      const snapShot = await getDocs(query2);
      snapShot.forEach(async (pdoc) => {
        const userDocRef = doc(db, "users", pdoc.id);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();

        await updateDoc(userDocRef, {
          followings: [...userData.followings, userid],
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  if (isLoading) {
    // Loading state
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

  if (follwerData.length === 0) {
    // No elements exist case
    return (
      <div>
        <p>No following users found.</p>
      </div>
    );
  }

  return (
    <>
      {follwerData.map((user, ind) => (
        <div className="follower-page">
          <div className="user-content flex justify-between items-center p-4 mt-8">
            <div className="flex gap-8">
              <div className="user-logo">
                <img
                  src={user.image}
                  alt=""
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
            {user.isFollow ? (
              <button>following</button>
            ) : (
              <Button type="button" onClick={() => handleFollow(ind, user.uid)}>
                Follow
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Followers;
