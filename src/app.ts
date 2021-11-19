import express from "express";
import cors from "cors";
import db from "./database/serverDB";
import userRouter from "./routes/UserRouter";

const app = express();

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB connection - success");
});

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "ok", status: 200 });
});

export default app;
