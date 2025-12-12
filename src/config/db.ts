import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.DBURL!);
        const url = `${connection.host}:${connection.port}`;

        console.log(colors.green.bold("Mongo Conectado en " + url));
    } catch (error) {
        console.log(colors.red((error as Error).message));
        exit(1);
    }
};
