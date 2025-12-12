import { Router } from "express";
import { body, param } from "express-validator";
import { GuestController } from "../controllers/Guest.Controller";
import { handleValidation } from "../middleware/validate";

const router = Router();

router.post(
    "/",
    body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
    body("phone").optional().isNumeric().withMessage("El número telefónico debe ser válido"),
    body("guests").optional().isArray().withMessage("Guests debe ser un arreglo"),
    body("guests.*.id").optional().isNumeric().withMessage("El ID del invitado debe ser numérico"),
    body("guests.*.name").optional().notEmpty().withMessage("El nombre del invitado no puede ir vacío"),
    handleValidation,
    GuestController.create
);

router.get(
    "/",
    param("confirmed").optional().isBoolean().withMessage("El filtro 'confirmed' debe ser true o false"),
    handleValidation,
    GuestController.getAll
);

export default router;
