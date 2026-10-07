import express  from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.get("/", (req, res)=> {
    res.send("El Servidor funciona")
})

//Agregar inicio de rutas
app.use("/")

// Cualquier error lanzado dentro de un controller async cae acá.

export default app;