import {
  SignInAndUp,
  ThirdpartyEmailPasswordComponentsOverrideProvider,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";

const LoginPage = () => {
  let sessionContext = Session.useSessionContext();
  if (sessionContext.loading) {
    return null;
  }
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        gridTemplateColumns: "repeat(2, 1fr)",
      }}
    >
      <div>left side stuff</div>
      <div>
        <ThirdpartyEmailPasswordComponentsOverrideProvider
          components={{
            // In this case, the <EmailPasswordSignInHeader_Override> will render the original component
            // wrapped in a div with an octocat picture above it.
            EmailPasswordSignInHeader_Override: ({
              DefaultComponent,
              ...props
            }) => {
              return (
                <div>
                  <img src="logo.jpg" />
                  <DefaultComponent {...props} />
                </div>
              );
            },
          }}
        >
          <SignInAndUp />
        </ThirdpartyEmailPasswordComponentsOverrideProvider>
      </div>
    </div>
  );
};

export default LoginPage;
