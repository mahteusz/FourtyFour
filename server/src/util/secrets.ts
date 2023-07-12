import "dotenv/config"

export const MONGODB_URI = process.env["MONGODB_URI"];
if (!MONGODB_URI) {
    console.log("Set MONGODB_URI environment variable.");
    process.exit(1);
}

export const JWT_ACCESS_SECRET = process.env["JWT_ACCESS_SECRET"];
if (!JWT_ACCESS_SECRET) {
    console.log("Set JWT_ACCESS_SECRET environment variable.");
    process.exit(1);
}

export const JWT_REFRESH_SECRET = process.env["JWT_REFRESH_SECRET"];
if (!JWT_ACCESS_SECRET) {
    console.log("Set JWT_REFRESH_SECRET environment variable.");
    process.exit(1);
}
