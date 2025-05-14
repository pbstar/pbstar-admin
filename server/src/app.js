import express from "express";
import mainRouter from "./routes/main.js";
import systemRouter from "./routes/system.js";
import exampleRouter from "./routes/example.js";

const app = express();

// 中间件
app.use(express.json());

// 路由
app.use("/main", mainRouter);
app.use("/system", systemRouter);
app.use("/example", exampleRouter);

// 简单错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

export default app;
