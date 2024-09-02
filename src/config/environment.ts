import 'dotenv/config';

const CONFIG = {
  db: process.env.DB,
  jwt_public: process.env.jwt_public_key!,
  jwt_private: process.env.jwt_private_key!,
};

export default CONFIG;
