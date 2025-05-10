const ENV = {
    // appUrl : process.env.APP_URL,
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT || 3001
    // CLIENT_URL : "http://localhost:4000/",
    // jwtSecretKey : process.env.JWT_SECRET_KEY,

    // ACCESS_TOKEN_PRIVATE_KEY : process.env.ACCESS_TOKEN_PRIVATE_KEY,
    // REFRESH_TOKEN_PRIVATE_KEY : process.env.REFRESH_TOKEN_PRIVATE_KEY,

    // ACCESS_TOKEN_PUBLIC_KEY : process.env.ACCESS_TOKEN_PUBLIC_KEY,
    // REFRESH_TOKEN_PUBLIC_KEY : process.env.REFRESH_TOKEN_PUBLIC_KEY,
} as const;

export type configType = typeof ENV[keyof typeof ENV]

export default ENV;