import express from "express";
import path from "path";
import cors from "cors";
import db from "./database/serverDB";
import userRouter from "./routes/UserRouter";
import friendRouter from "./routes/FriendRouter";
import postRouter from "./routes/PostRouter";
import commentRouter from "./routes/CommentRouter";

const app = express();

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB connection - success");
});

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use("/users", userRouter);
app.use("/friends", friendRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use((req, res) => {
    res.status(404).json({ message: "Route does not exist", status: 404 });
});

export default app;
