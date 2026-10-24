import express, {Request, Response} from "express";
import cors from "cors";
import usuarioRoutes from "./routes/Usuarioruta.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req: Request,res:Response) =>{
    res.send("hola");
});

app.listen(PORT,()=>{
    console.log("Corriendo");
});