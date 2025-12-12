import type { Request, Response } from "express";
import Guest from "../models/Guests";
import { sendEmail } from "../helpers/nodemailer";

export class GuestController {
    static create = async (req: Request, res: Response) => {
        try {
            const { name, guests, phone, confirmed } = req.body;

            const phoneValue = phone === 0 ? null : phone;

            if (phoneValue) {
                const exist = await Guest.findOne({ phone: phoneValue });
                if (exist) {
                    return res.status(400).json({
                        code: 400,
                        message: "El número de teléfono ya está registrado",
                    });
                }
            }

            const newGuestData = {
                name,
                guests,
                phone: phoneValue,
                confirmed: confirmed ?? false,
            };
            // 2. Intentar enviar el correo
            // await sendEmail("vanncr98@gmail.com", newGuestData);

            // 3. Si el correo se envió, guardar en BD
            const newGuest = await Guest.create(newGuestData);

            return res.status(201).json({
                code: 201,
                message: "Invitación creada correctamente",
                data: newGuest,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: "Error al crear invitación",
                error,
            });
        }
    };

    static getAll = async (req: Request, res: Response) => {
        try {
            const { confirmed } = req.query;

            let filter = {};

            if (confirmed === "true") {
                filter = { confirmed: true };
            } else if (confirmed === "false") {
                filter = { confirmed: false };
            }

            const guests = await Guest.find(filter).sort({ createdAt: -1 });

            return res.status(200).json({
                code: 200,
                message: "Invitaciones obtenidas correctamente",
                data: guests,
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: "Error al obtener invitaciones",
                error,
            });
        }
    };
}
