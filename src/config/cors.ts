import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        const whitelist = [process.env.FRONTURL];

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Error de CORS"));
        }
    },
};
