import type { Request, Response } from "express";
import Payment from "../models/Payment";
import cloudinary from "../config/cloudinary";
import formidable from "formidable";
import { v4 as uuid } from "uuid";

export class PaymentController {
    static create = async (req: Request, res: Response) => {
        try {
            const { name, total } = req.body;

            if (!name || !total) {
                return res.status(400).json({
                    code: 400,
                    message: "Nombre y total son requeridos",
                });
            }

            const newPayment = new Payment(req.body);
            const create = await newPayment.save();

            return res.status(201).json({
                code: 201,
                message: "Invitación creada correctamente",
                data: create,
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: "Error al crear pago",
                error: error instanceof Error ? error.message : error,
            });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { settled, img } = req.body;

            if (settled === undefined && img === undefined) {
                return res.status(400).json({
                    code: 400,
                    message: "Se requiere al menos un campo para actualizar (settled o img)",
                });
            }

            const updateFields: Partial<{ settled: boolean; img: string }> = {};
            if (settled !== undefined) updateFields.settled = settled;
            if (img !== undefined) updateFields.img = img;

            const updated = await Payment.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true, runValidators: true },
            );

            if (!updated) {
                return res.status(404).json({
                    code: 404,
                    message: "Pago no encontrado",
                });
            }

            return res.status(200).json({
                code: 200,
                message: "Pago actualizado correctamente",
                data: updated,
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: "Error al actualizar pago",
                error: error instanceof Error ? error.message : error,
            });
        }
    };

    static getAll = async (req: Request, res: Response) => {
        try {
            const payments = await Payment.find();

            return res.status(200).json({
                code: 200,
                message: "Invitaciones obtenidas correctamente",
                data: payments,
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: "Error al obtener invitaciones",
                error,
            });
        }
    };

    static uploadImage = async (req: Request, res: Response) => {
        try {
            const form = formidable({ multiples: false });

            form.parse(req, (error, _fields, files) => {
                if (error) {
                    return res.status(400).json({
                        code: 400,
                        message: "Error al procesar la imagen",
                    });
                }

                if (!files.img?.[0]) {
                    return res.status(400).json({
                        code: 400,
                        message: "No se recibió ninguna imagen",
                    });
                }

                cloudinary.uploader.upload(
                    files.img[0].filepath,
                    { folder: "payments", public_id: uuid() },
                    (e, result) => {
                        if (e || !result) {
                            return res.status(400).json({
                                code: 400,
                                message: "Error al subir la imagen a Cloudinary",
                            });
                        }

                        return res.status(200).json({
                            code: 200,
                            message: "Imagen subida correctamente",
                            url: result.secure_url,
                        });
                    },
                );
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: "Error de servidor",
                error: error instanceof Error ? error.message : error,
            });
        }
    };
}
