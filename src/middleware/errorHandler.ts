import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../utils/errors.js";

// Middleware de errores: Express lo reconoce por tener 4 parámetros.
// Se registra UNA sola vez, al final de todas las rutas en app.ts/index.ts.
// Cualquier error lanzado (throw) o rechazado (reject) dentro de un controller
// async termina acá automáticamente (esto lo hace solo Express 5, sin wrappers).
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Caso 1: errores propios de la app (AppError y sus subclases)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ ok: false, mensaje: err.message });
    return;
  }

  // Caso 2: errores conocidos de Prisma que no capturaste manualmente antes
  // (ej: un unique constraint que se te escapó sin validar en el service)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      // P2002 = violación de constraint único (email, dni, nombre de categoría, etc.)
      res.status(409).json({
        ok: false,
        mensaje: "Ya existe un registro con ese valor único",
      });
      return;
    }
    if (err.code === "P2025") {
      // P2025 = intentaste actualizar/borrar un registro que no existe
      res.status(404).json({ ok: false, mensaje: "Registro no encontrado" });
      return;
    }
  }

  // Caso 3: cualquier otro error no previsto (bug real)
  console.error("Error no controlado:", err); // esto queda en TU consola, no se lo mandamos al cliente
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
};