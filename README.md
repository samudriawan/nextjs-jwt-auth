# Next.js 12.3.1 - Login and Authorization using JWT

Repository built with <b>Next.js 12.3.1</b>

User Login and Authorization system with [JSON Web Token (JWT)](https://www.npmjs.com/package/jsonwebtoken) access token, refresh token rotation and refesh token reused detection.

- **Access Token** - to access secure route and get user data. Include in HTTP `Authorization` header for every secure route request.
- **Refresh Token** - after access token expires, refresh token is use to create new access token and new refresh token.
- **Refresh Token Reuse Detection** - follow the flow from [auth0](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/#Refresh-Token-Automatic-Reuse-Detection).

I'm storing users data in a JSON file located at `/data/db.json`, using [MongoDB](https://www.mongodb.org/) with [mongoose](https://www.npmjs.com/package/mongoose) at `mongoose` branch.

Some code follow from [Refresh Token Rotation](https://github.com/gitdagray/refresh_token_rotation).

## Learn Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
