import "dotenv/config"
import express, {Request, Response} from "express";
import cors from "cors";
import usuarioRoutes from "./routes/Usuarioruta.js";
import { pool } from "./config/database.js";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req: Request,res:Response) =>{
    res.send("hola");
});

async function iniciarServidor() {
    try{
        await pool.query("SELECT 1");

        console.log("Conexion con PostgreSQL existosa");

        app.listen(PORT,()=>{
            console.log(`Corriendo servidor en http://localhost:${PORT}`);
        });
        
    }catch(error){
        console.error("Error al conectar con Postgre: ", error);
        process.exit(1);
    }
}

iniciarServidor();