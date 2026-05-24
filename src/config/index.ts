import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  PORT: Number(process.env.PORT),
  CONNECTION_STRING: process.env.CONNECTION_STRING as string,
};

export default config;
