import { Router } from "express";
import { body, param } from "express-validator";
import { PaymentController } from "../controllers/Payment.Controller";
import { handleValidation } from "../middleware/validate";

const router = Router();

router.post(
    "/",
    body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
    body("total").notEmpty().isNumeric().withMessage("El total debe ser un número válido"),
    handleValidation,
    PaymentController.create,
);

router.patch(
    "/:id",
    param("id").isMongoId().withMessage("El ID no es válido"),
    body("settled").optional().isBoolean().withMessage("settled debe ser un booleano"),
    body("img").optional().isString().withMessage("img debe ser una cadena de texto"),
    handleValidation,
    PaymentController.update,
);

router.get("/", handleValidation, PaymentController.getAll);

router.post("/upload", PaymentController.uploadImage);

export default router;
