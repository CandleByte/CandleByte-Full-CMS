import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT SECRET IS MOT DEFINED IN .env FILE');
}

const env = {
    PORT: process.env.PORT || '5001',
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.URI,
}




export default env;

