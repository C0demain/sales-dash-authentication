declare global {
    namespace Express {
        interface Request {
            user?: UserBasicInfo | null;
        }
    }
}