import type { NextPage } from "next";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

const PrivatePage: NextPage = () => {
  return (
    <SessionAuth>
      <div>This is a private page</div>
    </SessionAuth>
  );
};

export default PrivatePage;
