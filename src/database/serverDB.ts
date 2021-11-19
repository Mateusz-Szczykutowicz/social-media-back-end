import mongoose from "mongoose";

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/social-media-app");
}

export default mongoose.connection;
