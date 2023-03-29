import Head from "next/head";
import styles from "../styles/Home.module.css";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import {
  SessionAuth,
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";
import { useState } from "react";

function ProtectedPage() {
  const session = useSessionContext();

  async function logoutClicked() {
    await ThirdPartyEmailPassword.signOut();
    redirectToAuth();
  }

  const [apiResponse, setApiResponse] = useState("");

  async function fetchData() {
    const res = await fetch("http://localhost:3001/restricted", {
      credentials: "include",
    });
    if (res.status === 200) {
      const json = await res.json();
      setApiResponse(json);
    }
  }

  if (session.loading === true) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>SuperTokens 💫</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p className={styles.description}>
          UserId: {session.userId} <br />
        </p>
        <p className={styles.description}>
          Access token payload: {JSON.stringify(session.accessTokenPayload)}
        </p>
        <div
          onClick={logoutClicked}
          style={{
            display: "flex",
            width: "116px",
            height: "42px",
            backgroundColor: "#000000",
            borderRadius: "10px",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          SIGN OUT
        </div>
        <div
          onClick={fetchData}
          style={{
            display: "flex",
            width: "150px",
            height: "42px",
            backgroundColor: "rgb(247 54 54)",
            borderRadius: "10px",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          FETCH USER API
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "150px",
          }}
        >
          <h2>Api Response Data:</h2>
          <pre>{JSON.stringify(apiResponse, null, 2)} </pre>
        </div>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <SessionAuth>
      <ProtectedPage />
    </SessionAuth>
  );
}
