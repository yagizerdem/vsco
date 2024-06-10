import { Fragment, useRef, useState } from "react";
import styles from "../styles/register.module.css";
import Image from "next/image";
import notify from "@/util/notify";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const static_modes = {
  login: 0,
  singup: 1,
};
const extra_styles = {
  show: {
    transform: "rotateY(0deg)",
  },
  hide: {
    transform: "rotateY(180deg)",
  },
};

export default function Register() {
  const [mode, setMode] = useState(static_modes.singup);
  const [src, setSrc] = useState(null);
  const signUpRef = useRef();
  const logInRef = useRef();
  const router = useRouter();

  function render(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const src = reader.result;
      setSrc(src);
    };
  }
  async function signUp(e) {
    e.preventDefault();
    const formData = new FormData(signUpRef.current);
    const body = {};
    for (let [key, value] of formData) {
      body[key] = value;
    }
    body.profileImage = src;

    try {
      const { data } = await axios.post("/api/signUp", body);
      if (!data?.ok) {
        notify(data?.message);
        return;
      }
      // successfull sign up
      notify(data?.message);
      setMode(static_modes.login);
    } catch (err) {
      console.log(err);
      notify("error occured");
    }
  }
  async function logIn(e) {
    e.preventDefault();
    try {
      const formData = new FormData(logInRef.current);
      const body = {};
      for (let [key, value] of formData) {
        body[key] = value;
      }
      let result = await signIn("credentials", {
        redirect: false,
        email: body?.email,
        password: body?.password,
      });
      if (result?.status.toString()[0] * 1 >= 4 || !result?.ok) {
        notify("log in failed , check your credentials ... ");
        return;
      }
      notify("log in success");
      router.push("/");
    } catch (err) {
      console.log(err);
      notify("error occured while log in");
    }
  }

  return (
    <Fragment>
      <div className={styles.background}>
        <div className={styles.center}>
          <div className={styles.card}>
            <button className={styles.goBack} onClick={() => router.push("/")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </button>
            <div
              className={styles.front}
              style={
                mode == static_modes.singup
                  ? {
                      ...extra_styles.show,
                    }
                  : {
                      ...extra_styles.hide,
                    }
              }
            >
              <h2>SignUp</h2>
              <hr />
              <form ref={signUpRef}>
                <input
                  placeholder="enter your first name"
                  name="firstname"
                ></input>
                <input
                  placeholder="enter your last name"
                  name="lastname"
                ></input>
                <input placeholder="enter email" name="email"></input>
                <input
                  placeholder="enter your password"
                  name="password"
                ></input>
                <label htmlFor="profileinput">select profile image</label>
                <input
                  type="file"
                  id="profileinput"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) => render(e)}
                ></input>
                <div className={styles.frame}>
                  {src && (
                    <Image
                      src={decodeURIComponent(src)}
                      fill={true}
                      alt="profile image"
                    ></Image>
                  )}
                  <button type="button" className={styles.delete}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      onClick={() => setSrc(null)}
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                  </button>
                </div>
                <button onClick={(e) => signUp(e)}>submit</button>
              </form>
            </div>
            <div
              className={styles.back}
              style={
                mode == static_modes.singup
                  ? {
                      ...extra_styles.hide,
                    }
                  : {
                      ...extra_styles.show,
                    }
              }
            >
              <form ref={logInRef}>
                <h2>Log In</h2>
                <hr />
                <input name="email" placeholder="email"></input>
                <input name="password" placeholder="password"></input>
                <button onClick={(e) => logIn(e)}>log in</button>
              </form>
            </div>
          </div>
        </div>
        <a
          href="#"
          onClick={() =>
            setMode((prev) =>
              prev == static_modes.singup
                ? static_modes.login
                : static_modes.singup
            )
          }
        >
          {mode == static_modes.singup
            ? "switch to log in "
            : "switch to sing up"}{" "}
        </a>
      </div>
    </Fragment>
  );
}
