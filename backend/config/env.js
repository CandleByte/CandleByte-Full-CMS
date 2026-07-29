import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT SECRET IS MOT DEFINED IN .env FILE');
}

const env = {
    PORT: process.env.PORT || '5001',
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
}




export default env;

