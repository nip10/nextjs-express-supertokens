import Router from "next/router";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import type { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { appInfo } from "./appInfo";

export let frontendConfig = (): SuperTokensConfig => {
  return {
    appInfo,
    enableDebugLogs: true,
    recipeList: [
      EmailVerification.init({
        mode: "OPTIONAL",
      }),
      ThirdPartyEmailPassword.init({
        useShadowDom: false,
        signInAndUpFeature: {
          providers: [ThirdPartyEmailPassword.Google.init()],
          signUpForm: {
            termsOfServiceLink: "https://example.com/terms-of-service",
            privacyPolicyLink: "https://example.com/privacy-policy",
          },
          disableDefaultUI: true,
        },
        style: `
          [data-supertokens~="superTokensBranding"] {
              display: none;
          }
          [data-supertokens~=container] {
              --palette-background: 51, 51, 51;
              --palette-inputBackground: 41, 41, 41;
              --palette-inputBorder: 41, 41, 41;
              --palette-textTitle: 255, 255, 255;
              --palette-textLabel: 255, 255, 255;
              --palette-textPrimary: 255, 255, 255;
              --palette-error: 173, 46, 46;
              --palette-textInput: 169, 169, 169;
              --palette-textLink: 169, 169, 169;
              --palette-primary: 159,122,234;
              --palette-primaryBorder: 159,122,234;
          }
            `,
        onHandleEvent: async (context) => {
          // add analytics here
          if (context.action === "SUCCESS") {
            let user = context.user;
            if (context.isNewUser) {
              // sign up success
            } else {
              // sign in success
            }
          }
        },
      }),
      Session.init(),
    ],
    // The user will be taken to the custom path when then need to login.
    getRedirectionURL: async (context) => {
      if (context.action === "TO_AUTH") {
        return "/foo";
      }
    },
    // this is so that the SDK uses the next router for navigation
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href) => {
            Router.push(href);
          },
        },
      };
    },
  };
};
