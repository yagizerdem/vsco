import { Fragment, useEffect, useState } from "react";
import styles from "../../styles/profile.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Database from "@/lib/Database";
import User from "@/models/User";
import { useRouter } from "next/router";
import axios from "axios";
export default function Profile({
  email,
  username,
  visitor,
  followerCount,
  followingCount,
  profileImage,
}) {
  const router = useRouter();
  const [allImages, setAllImages] = useState([]);
  const [page, setPage] = useState(0);
  const { id } = router.query;
  const dynamicRoute = useRouter().asPath;

  useEffect(() => {
    async function helper() {
      const queryParams = {
        skip: page * 9,
        limit: 9,
        userid: id,
      };

      try {
        const { data } = await axios.get("/api/getImages", {
          params: queryParams,
        });
        const imageDataList = data?.data;
        setAllImages((prev) => [...prev, ...imageDataList]);
      } catch (err) {
        console.log(err);
      }
    }
    helper();
  }, [page, id]);
  useEffect(() => {
    setAllImages([]);
  }, [dynamicRoute]);

  return (
    <Fragment>
      <div className={styles.header}>
        {profileImage && (
          <img
            src={profileImage}
            alt="profile image"
            className={styles.profile}
          ></img>
        )}
        <h2 className={styles.username}>{username}</h2>
        <div className={styles.followmetadata}>
          <span>following : {followingCount}</span>
          <span>follower : {followerCount}</span>
        </div>
      </div>
      {!visitor && (
        <button
          className={styles.uploadpicbtn}
          onClick={() => router.push("/UploadImage")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
        </button>
      )}
      <div className={styles.imgContainer}>
        {allImages.map((data, i) => {
          return <img src={data.base64} alt="image" key={i} />;
        })}
      </div>
      <button
        className={styles.more}
        onClick={() => setPage((prev) => prev + 1)}
      >
        Load more
      </button>
    </Fragment>
  );
}
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // session data
  const params = context.params;
  const userid = params?.id;
  const visitor = userid != session.user.id ? true : false;

  const db = new Database();
  await db.open();
  const userFromDb = await db.findOne(User, { _id: userid });
  await db.close();
  const followerCount = userFromDb.followers.length;
  const followingCount = userFromDb.following.length;
  const profileImage = userFromDb.profileImage;
  const username = `${userFromDb.firstname}  ${userFromDb.lastname}`;
  const email = userFromDb?.email;
  return {
    props: {
      username,
      visitor,
      email,
      followerCount,
      followingCount,
      profileImage,
    },
  };
}
