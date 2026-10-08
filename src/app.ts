import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { NotFoundError } from "./utils/errors.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("El Servidor funciona");
});

// Agregar inicio de rutas
// app.use("/api/...", ...)

// 404 para rutas inexistentes: lo derivamos al errorHandler como NotFoundError
app.use((req, _res, next) => {
  next(new NotFoundError(`Ruta no encontrada: ${req.method} ${req.path}`));
});

// Cualquier error lanzado dentro de un controller async cae acá.
app.use(errorHandler);

export default app;
