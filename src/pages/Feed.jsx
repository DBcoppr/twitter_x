import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { useUserContext } from "../context/userContext";
import { db } from "../firebase";
import { timeAgo } from "../utils/timeDate";

const Feed = () => {
  const [isWrite, setIsWrite] = useState(false);
  const { user } = useUserContext();
  const [postText, setPostText] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const promiseAr = [];
      const finalData = [];
      querySnapshot.docs.forEach(async (postDoc) => {
        const postData = { id: postDoc.id, ...postDoc.data() };
        const q = query(
          collection(db, "users"),
          where("uid", "==", postData.uid)
        );
        finalData.push(postData);
        promiseAr.push(getDocs(q));
      });

      const response = Promise.all(promiseAr);
      (await response).forEach((item, ind) => {
        item.forEach((pdoc) => {
          const { username, email, image } = pdoc.data();
          finalData[ind] = { ...finalData[ind], username, email, image };
        });
      });
      setAllPosts(finalData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handlePost() {
    if (postText) {
      let ID = `${Date.now()}-${user.uid.slice(8)}`;
      try {
        await addDoc(collection(db, "posts"), {
          text: postText,
          uid: user.uid,
          date: serverTimestamp(),
          postID: ID,
        });

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (pdoc) => {
          const userDocRef = doc(db, "users", pdoc.id);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();

          await updateDoc(userDocRef, {
            posts: [...userData.posts, ID],
          });
        });
        fetchPosts();
        setPostText("");
        setIsWrite(false);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      alert("empty post");
    }
  }

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

  if (allPosts.length === 0) {
    return (
      <div>
        <p>No such posts</p>
      </div>
    );
  }

  return (
    <>
      <div className="user-feed-page w-[40%] m-auto pt-[6rem]">
        <Button type="button" onClick={() => setIsWrite(!isWrite)}>
          Write
        </Button>
        <textarea
          id=""
          cols="30"
          rows="10"
          onChange={(e) => setPostText(e.target.value)}
          className={` ${
            isWrite ? "block" : "hidden"
          } w-full h-32 p-2 border rounded-md my-4`}
        ></textarea>
        {isWrite && (
          <Button type="button" onClick={handlePost}>
            Post
          </Button>
        )}

        {!allPosts && !allPosts.length > 0 ? (
          <>Loading..</>
        ) : (
          <>
            {allPosts.map((item, ind) => (
              <div
                key={ind}
                className="user-content flex gap-2 relative overflow-hidden p-4 custom-shadow rounded-2xl mt-8"
              >
                <div className="user-logo self-center ">
                  <img
                    src={item.image}
                    alt=""
                    className="w-10 h-10  rounded-full border border-slate-400"
                  />
                </div>
                <div className="user-detail w-full">
                  <div className="flex justify-between items-center px-4 pt-1 pb-3">
                    <p className="text-[1.2rem] font-medium text-slate-700">
                      {item.username}
                    </p>
                    <p className="text-[0.7rem] text-slate-500">
                      {timeAgo(item.date)}{" "}
                    </p>
                  </div>
                  <p className="text-[0.8rem] pl-4 pr-8 text-slate-500">
                    {item.text}
                  </p>
                  <div className="w-10 h-10 bg-rose-400 absolute right-[-1.2rem] top-[40%] rounded-full"></div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Feed;
