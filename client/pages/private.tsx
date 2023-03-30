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
      <p>User id: {session.userId} </p>
    </SessionAuth>
  );
};

export default PrivatePage;
