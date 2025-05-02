import express from "express";
import baseRouter from "./routes/base.js";

const app = express();

// 中间件
app.use(express.json());

// 路由
app.use("/base", baseRouter);

// 简单错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;
