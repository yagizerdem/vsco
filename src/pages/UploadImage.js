import { useRef, useState } from "react";
import styles from "../styles/uploadImage.module.css";
import notify from "@/util/notify";
import axios from "axios";
import { useRouter } from "next/router";
export default function UploadImage() {
  const inputRef = useRef();
  const formRef = useRef();
  const [base64, setBase64] = useState(null);
  const router = useRouter();
  async function submit(e) {
    e.preventDefault();
    if (!base64) {
      notify("image file must selected");
      return;
    }

    const body = {};
    const formData = new FormData(formRef.current);
    for (let [key, value] of formData) {
      body[key] = value;
    }
    body.showComments = body.showComments ? true : false;
    body.base64 = base64;
    const { data } = await axios.post("/api/postImage", body);
    if (!data.ok) {
      notify(data.message);
      return;
    }
    notify(data.message);
    router.push("/");
  }
  function readImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const src = reader.result;
      setBase64(src);
    };
  }

  return (
    <div className={styles.container}>
      <div className={styles.frame} onClick={() => inputRef.current.click()}>
        <button
          className={styles.delete}
          onClick={(e) => {
            e.stopPropagation();
            setBase64(null);
          }}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
        </button>
        <img
          src={base64}
          alt="post image ... "
          className={styles.preview}
        ></img>
      </div>
      <label htmlFor="select">select your file ... </label>
      <input
        type="file"
        hidden
        id="select"
        ref={inputRef}
        onChange={(e) => readImage(e)}
      ></input>
      <form ref={formRef}>
        <input
          type="text"
          placeholder="enter post name"
          name="postname"
        ></input>
        <input type="checkbox" name="showComments" defaultChecked></input>
        <button onClick={(e) => submit(e)} className={styles.submit}>
          submit post
        </button>
      </form>
    </div>
  );
}
