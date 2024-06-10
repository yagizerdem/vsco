"use client";
import { Fragment, useRef, useState } from "react";
import { filterChrome, getEditorDefaults } from "@pqina/pintura";
import style from "../styles/studio.module.css";
import Image from "next/image";

// Import the editor component from `react-pintura`
import { PinturaEditor } from "@pqina/react-pintura";
// get default properties
const editorConfig = getEditorDefaults();

export default function Studio() {
  const editorRef = useRef();
  const [output, setOutputOfFrame] = useState(null);
  const dowloadRef = useRef();
  const handleUndo = () => {
    const { editor } = editorRef.current;

    editor.history.undo();
  };
  const loadImage = (e) => {
    // read image file
    const file = e.target.files[0];
    editorRef.current.editor.loadImage(file).then((imageReaderResult) => {
      console.log(imageReaderResult);
    });
  };
  async function processImage(e) {
    var imageWriterResult = await editorRef.current.editor.processImage();
    const file = imageWriterResult.dest;
    // Convert to base64
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = function () {
    //   const base64String = reader.result;
    //   setOutputOfFrame(base64String); // Set output to base64 string
    // };
    // reader.onerror = function (error) {
    //   console.log("Error: ", error);
    // };
    setOutputOfFrame(file);
  }
  function downloadImage() {
    if (!output) return;
    const url = URL.createObjectURL(output);

    // Create an anchor element
    const link = document.createElement("a");
    link.href = url;
    var date = new Date();
    var ticks = date.getTime() * 10000 + 621355968000000000;
    link.download = ticks.toString(); // Set the download attribute to specify the filename

    // Append the anchor element to the document body
    document.body.appendChild(link);

    // Trigger a click event on the anchor element to initiate the download
    link.click();

    // Cleanup: remove the anchor element and revoke the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Fragment>
      <div style={{ height: "600px" }}>
        <PinturaEditor
          ref={editorRef}
          {...editorConfig}
          imageCropAspectRatio={1}
        ></PinturaEditor>
      </div>
      <button onClick={handleUndo} className={style.undo}>
        Undo
      </button>
      <label className={style.loadimage} htmlFor="imginput">
        Load Image
      </label>
      <input
        type="file"
        hidden
        id="imginput"
        onChange={(e) => loadImage(e)}
      ></input>
      <button type="button" onClick={processImage} className={style.loadimage}>
        Process image
      </button>
      <h2>output</h2>

      <div className={style.frame}>
        {output && <img src={URL.createObjectURL(output)} />}
        <button className={style.delete} onClick={() => setOutputOfFrame(null)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
        </button>
        <a
          className={style.download}
          onClick={() => downloadImage()}
          href="#"
          ref={dowloadRef}
        >
          download image
        </a>
      </div>
    </Fragment>
  );
}
