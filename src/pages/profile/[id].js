import { Fragment } from "react";
import styles from "../../styles/profile.module.css";

export default function Profile() {
  return (
    <Fragment>
      <div className={styles.header}></div>
    </Fragment>
  );
}
export async function getServerSideProps() {
  return { props: { user: "" } };
}
