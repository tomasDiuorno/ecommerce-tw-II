import "dotenv/config"

import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple"

import usuarioRoutes from "./routes/Usuarioruta.js";
import { pool } from "./config/database.js";
import productoRoutes from "./routes/productoRuta.js";
import categoriaRoutes from "./routes/categoriaRuta.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import envioRoutes from './routes/envioRuta.js';

const app = express();
const PORT = 3000;

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    throw new Error("Falta configurar SESSION_SECRET en el archivo .env");
}

const PgSession = connectPgSimple(session);

// Almacenamiento de sesiones, aca se conecta pg-simple con Pool
const sessionStore = new PgSession({
    pool,
    tableName: "sesiones",
    createTableIfMissing: true
});

// Config para que el navegador envie cookies al back
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));
app.use(express.json());

//Config de cookie
app.use(session({
    store: sessionStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use('/api/envios', envioRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);

app.get("/test-session", (req: Request, res: Response) => {
    req.session.prueba = true;

    res.json({
        mensaje: "Sesión de prueba creada",
        sessionID: req.sessionID
    });
});

app.get("/", (req: Request, res: Response) => {
    res.send("hola");
});
app.use(errorHandler);
async function iniciarServidor() {
    try {
        await pool.query("SELECT 1");

        console.log("Conexion con PostgreSQL existosa");

        app.listen(PORT, () => {
            console.log(`Corriendo servidor en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al conectar con Postgre: ", error);
        process.exit(1);
    }
}

iniciarServidor();