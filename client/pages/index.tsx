import { useState } from "react";
import Head from "next/head";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import {
  SessionAuth,
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";

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
    <div>
      <Head>
        <title>SuperTokens 💫</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <p>
          UserId: {session.userId} <br />
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "350px",
          }}
        >
          <h2>Access token payload:</h2>
          <pre>{JSON.stringify(session.accessTokenPayload, null, 2)} </pre>
        </div>
        <button onClick={logoutClicked}>SIGN OUT</button>
        <button onClick={fetchData}>FETCH USER API</button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "350px",
          }}
        >
          <h2>Api Response Data:</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {JSON.stringify(apiResponse, null, 2)}{" "}
          </pre>
        </div>
      </main>
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
