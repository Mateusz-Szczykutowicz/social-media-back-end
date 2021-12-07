import mongoose from "mongoose";
import config from "../config";

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(config.DB.host);
}

export default mongoose.connection;
