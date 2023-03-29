const port = process.env.APP_PORT || 3000;

const apiBasePath = "/api/auth/";

export const websiteDomain =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  `http://localhost:${port}`;

export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: "MyTestApp",
  apiDomain: "http://localhost:3001",
  websiteDomain: "http://localhost:3000",
  apiBasePath: "/v1/auth",
  websiteBasePath: "/auth",
};
