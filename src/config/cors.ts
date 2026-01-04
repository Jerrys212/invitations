import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        // LOGS PARA DEBUG
        console.log("=== DEBUG CORS ===");
        console.log("Origin recibido:", origin);
        console.log("FRONTURL env:", process.env.FRONTURL);
        console.log("==================");

        const whitelist = [process.env.FRONTURL, "http://localhost:5173"];

        // Permitir requests sin origin
        if (!origin) {
            console.log("✅ Permitiendo request sin origin");
            callback(null, true);
            return;
        }

        if (whitelist.includes(origin)) {
            console.log("✅ Origin permitido");
            callback(null, true);
        } else {
            console.log("❌ Origin rechazado");
            console.log("Whitelist:", whitelist);
            console.log("Origin recibido:", origin);
            callback(new Error("Error de CORS"));
        }
    },
};
