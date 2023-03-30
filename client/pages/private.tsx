import type { NextPage } from "next";
import {
  SessionAuth,
  useSessionContext,
} from "supertokens-auth-react/recipe/session";

const PrivatePage: NextPage = () => {
  const session = useSessionContext();
  if (session.loading === true) {
    return <div>Loading...</div>;
  }

  return (
    <SessionAuth>
      <div>This is a private page</div>
      <div>
        <h2>Session </h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {JSON.stringify(session, null, 2)}{" "}
        </pre>
      </div>
    </SessionAuth>
  );
};

export default PrivatePage;
