import * as dotenv from "dotenv";
dotenv.config();
import express, { type Request, type Response } from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import {
  errorHandler as superTokensErrorHandler,
  middleware as superTokensMiddleware,
  SessionRequest,
} from "supertokens-node/lib/build/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const { SUPERTOKENS_CONNECTION_URI, SUPERTOKENS_API_KEY } = process.env;

supertokens.init({
  framework: "express",
  supertokens: {
    // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: SUPERTOKENS_CONNECTION_URI!,
    apiKey: SUPERTOKENS_API_KEY!,
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
    appName: "MyTestApp",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/v1/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      providers: [
        // We have provided you with development keys which you can use for testing.
        // IMPORTANT: Please replace them with your own OAuth keys for production use.
        ThirdPartyEmailPassword.Google({
          clientId:
            "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
          clientSecret: "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",
        }),
      ],
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,

            // override the email password sign up API
            emailPasswordSignUpPOST: async function (input) {
              if (
                originalImplementation.emailPasswordSignUpPOST === undefined
              ) {
                throw Error("Should never come here");
              }

              // TODO: some pre sign up logic

              let response =
                await originalImplementation.emailPasswordSignUpPOST(input);

              if (response.status === "OK") {
                // TODO: some post sign up logic
                console.log("[E+P] POST SIGN UP LOGIC", input, response);
              }

              return response;
            },

            // override the email password sign in API
            emailPasswordSignInPOST: async function (input) {
              if (
                originalImplementation.emailPasswordSignInPOST === undefined
              ) {
                throw Error("Should never come here");
              }

              // TODO: some pre sign in logic

              let response =
                await originalImplementation.emailPasswordSignInPOST(input);

              if (response.status === "OK") {
                // TODO: some post sign in logic

                console.log("[E+P] POST SIGN IN LOGIC", input, response);
              }

              return response;
            },

            // override the thirdparty sign in / up API
            thirdPartySignInUpPOST: async function (input) {
              if (originalImplementation.thirdPartySignInUpPOST === undefined) {
                throw Error("Should never come here");
              }

              // TODO: Some pre sign in / up logic

              let response =
                await originalImplementation.thirdPartySignInUpPOST(input);

              if (response.status === "OK") {
                if (response.createdNewUser) {
                  // TODO: some post sign up logic

                  console.log("[SOCIAL] POST SIGN UP LOGIC", input, response);
                } else {
                  // TODO: some post sign in logic

                  console.log("[SOCIAL] POST SIGN IN LOGIC", input, response);
                }
              }

              return response;
            },
          };
        },
      },
    }),
    // TODO: Not sure it this is needed
    Session.init(), // initializes session features
  ],
});

const app = express();

const whitelist = ["http://localhost:3000"];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(superTokensMiddleware());

app.get("/", (req: Request, res: Response) => {
  return res.json({
    data: "Hello world",
  });
});

app.get("/restricted", verifySession(), async (req: SessionRequest, res) => {
  const userId = req.session!.getUserId();
  const userInfo = await ThirdPartyEmailPassword.getUserById(userId);
  const accessToken = req.session!.getAccessToken();
  const accessTokenPayload = req.session!.getAccessTokenPayload();

  return res.json({
    userId,
    userInfo,
    accessToken,
    accessTokenPayload,
  });
});

app.use(superTokensErrorHandler());

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.statusCode) {
      res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

app.listen(3001, () => {
  console.log("Example app listening on port 3001");
});
