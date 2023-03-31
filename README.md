# NextJS Express SuperTokens

Just testing out NextJS with external NodeJS Express server and SuperTokens.

## Structure

- `server/` - NodeJS Express server
- `client/` - NextJS client

## Add extra info to session

You can add extra fields using metadata or expanding the access token payload. I'll focus on the latter.
There are two ways to do this:

### Solution 1: Use userContext

:warning: Limitation: You can only add extra info to the session **BEFORE** the user signs in (or whatever action).

1. Override the provider recipe api you want to use to get the user info and add it to the session. In this case, I'm using the `ThirdPartyEmailPassword` recipe and the `emailPasswordSignInPOST` api.

2. Add any property you want to the `userContext` object

in ThirdPartyEmailPassword.override.apis.emailPasswordSignInPOST

```ts
input.userContext.myProp = "some value";
// The call to the original implementation needs to be AFTER the userContext is set
const response = await originalImplementation.emailPasswordSignInPOST(input);
```

3. Override the session recipe function `createNewSession` to add the extra property to the session

in Session.override.functions.createNewSession

```ts
  async function (input) {
    input.accessTokenPayload = {
      ...input.accessTokenPayload,
      myProp: input.userContext.myProp,
    };
    return originalImplementation.createNewSession(input);
  }
```

### Solution 2: Use session.mergeIntoAccessTokenPayload (recommended)

1. Override the provider recipe api you want to use to get the user info and add it to the session. In this case, I'm using the `ThirdPartyEmailPassword` recipe and the `emailPasswordSignInPOST` api.

2. Add any property you want to the access token payload

in ThirdPartyEmailPassword.override.apis.emailPasswordSignInPOST

```ts
const extraAccessTokenPayload: JSONValue = {};
extraAccessTokenPayload.myProp = "some value";
await response.session.mergeIntoAccessTokenPayload(extraAccessTokenPayload);
```

## Notes

- The DX is not great, same with docs. I had to dig into the source code, see multiple examples, and even join their Discord to figure out how to use it. This is the opposite of my experience with Clerk. On the other hand, their support in the Discord server was very helpful and quick.
- Having to check session.loading everywhere is a pita, the user data should just be undefined until it's loaded. (similar to next-auth)
- Extra steps to add user info to the session
- Custom session and token data are not typesafe (no augumentation of the session and token types like next-auth)
- Weird page flashes when loading session
- No 2FA using TOTP (in progress)
- No support for NextJS 13 app directory (in progress)

All in all I'm not sure if I'll use this in production. The great thing about SuperTokens is that it's open source, and it will support 2FA using TOTP soon, which is usually a feature in paid services. Clerk seems much better in terms of DX, docs and they are growing a lot (series A), but access to 2FA TOTP is expensive (100usd/mo). I'll keep an eye on it.
