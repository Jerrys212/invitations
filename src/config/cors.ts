import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        const whitelist = [process.env.FRONTURL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean); // Elimina valores undefined

        if (!origin) {
            callback(null, true);
            return;
        }

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Error de CORS"));
        }
    },
};
