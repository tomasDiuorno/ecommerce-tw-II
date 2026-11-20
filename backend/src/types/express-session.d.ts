import "express-session";

declare module "express-session" {
    interface SessionData {
        prueba?: boolean;
        usuarioId?: number;
    }
}