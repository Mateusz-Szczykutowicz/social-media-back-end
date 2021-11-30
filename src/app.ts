import express from "express";
import cors from "cors";
import db from "./database/serverDB";
import userRouter from "./routes/UserRouter";
import friendRouter from "./routes/FriendRouter";

const app = express();

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB connection - success");
});

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRouter);
app.use("/friends", friendRouter);
app.use((req, res) => {
    res.status(404).json({ message: "Route does not exist", status: 404 });
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "ok", status: 200 });
});

export default app;
