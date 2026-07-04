import { connect, connections } from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const mongoUri = process.env.MONGODB;

export const connectDB = async () => {
    if (connections[0].readyState) return;
    await connect(mongoUri)
        .then(() => console.log("Connected to database"))
        .catch((error) => console.log("Error occured while connecting to database", error));
};
