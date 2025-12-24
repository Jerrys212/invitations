import type { Request, Response } from "express";
import Guest from "../models/Guests";
import { sendEmail } from "../helpers/nodemailer";

export class GuestController {
    static create = async (req: Request, res: Response) => {
        try {
            const { name, guests, phone, confirmed } = req.body;

            if (!name || !guests) {
                return res.status(400).json({
                    code: 400,
                    message: "Nombre y número de invitados son requeridos",
                });
            }

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

            const newGuest = await Guest.create(newGuestData);
            console.log(`✅ Guest creado en BD: ${newGuest._id} - ${name}`);

            // Envío de correos con logging detallado
            console.log(`\n📬 Iniciando envío de correos para guest: ${newGuest._id}`);

            Promise.all([
                sendEmail("ritaronces@gmail.com", newGuestData),
                sendEmail("jorgearquam@gmail.com", newGuestData),
            ])
                .then(() => {
                    console.log(`✅ TODOS los correos enviados correctamente para guest: ${newGuest._id}\n`);
                })
                .catch((emailError) => {
                    console.error(`\n❌ ERROR CRÍTICO al enviar correos para guest: ${newGuest._id}`);
                    console.error(`   Nombre: ${name}`);
                    console.error(`   Detalles del error:`, emailError);
                    console.error(`   Stack trace:`, emailError.stack);
                    console.error(`\n`);
                });

            return res.status(201).json({
                code: 201,
                message: "Invitación creada correctamente",
                data: newGuest,
            });
        } catch (error) {
            console.error("❌ Error en create:", error);
            return res.status(500).json({
                code: 500,
                message: "Error al crear invitación",
                error: error instanceof Error ? error.message : error,
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
