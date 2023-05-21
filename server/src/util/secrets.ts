import "dotenv/config"

export const MONGODB_URI = process.env["MONGODB_URI"];
console.log(MONGODB_URI)
if (!MONGODB_URI) {
    console.log("Set MONGODB_URI environment variable.");
    process.exit(1);
}
