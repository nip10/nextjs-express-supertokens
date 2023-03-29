import { SessionAuth } from "supertokens-auth-react/recipe/session";

const PrivatePage = () => {
  return (
    <SessionAuth>
      <div>This is a private page</div>
    </SessionAuth>
  );
};

export default PrivatePage;
