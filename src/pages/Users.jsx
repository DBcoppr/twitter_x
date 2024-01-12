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
import Button from "../components/Button";
import { useUserContext } from "../context/userContext";
import { db } from "../firebase";

const Users = () => {
  const { user } = useUserContext();
  const [userDataArray, setUserDataArray] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function handleFollow(ind, userid) {
    setUserDataArray([
      ...userDataArray,
      { ...userDataArray[ind], isFollowing: true },
    ]);
    try {
      const q = query(collection(db, "users"), where("uid", "==", userid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (pdoc) => {
        const userDocRef = doc(db, "users", pdoc.id);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        await updateDoc(userDocRef, {
          followers: [...userData.followers, user.uid],
        });
      });

      const query2 = query(
        collection(db, "users"),
        where("uid", "==", user.uid)
      );
      const snapShot = await getDocs(query2);
      snapShot.forEach(async (pdoc) => {
        const userDocRef = doc(db, "users", pdoc.id);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        await updateDoc(userDocRef, {
          followings: [...userData.followings, userid],
        });

        fetchData();
      });
    } catch (error) {
      console.error(error.message);
    }
  }
  const fetchData = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "!=", user.uid));
      const querySnapshot = await getDocs(q);

      const userDataArray = [];
      querySnapshot.forEach((userDoc) => {
        const userData = { id: userDoc.id, ...userDoc.data() };

        userData.isFollowing = userData.followers.includes(user.uid);
        userDataArray.push(userData);
      });

      setUserDataArray(userDataArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="pt-16">
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
      </div>
    );
  }

  if (userDataArray.length === 0) {
    // No elements exist case
    return (
      <div>
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="pt-[5rem]">
        {userDataArray.map((user, ind) => (
          <div
            className="users-page lg:w-[40%] md:w-[80%] m-auto"
            key={user.uid}
          >
            <div className="user-content flex justify-between items-center p-4 mt-4 border-b-2 border-slate-300">
              <div className="flex gap-8 pb-3 items-center">
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
                    <p className="text-[0.7rem] text-slate-400">Following {}</p>
                  </div>
                </div>
              </div>
              {user.isFollowing ? (
                <p className="text-[0.9rem]">Following</p>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleFollow(ind, user.uid)}
                >
                  Follow
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Users;
