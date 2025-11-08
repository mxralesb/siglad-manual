import express from "express";
import cors from "cors";
import validationRoute from "./routes/validation.js";
import authRoute from "./routes/auth.js";
import catalogsRoute from "./routes/catalogs.js";
import declarationsRoute from "./routes/declarations.js";
import exportersRoute from "./routes/exporters.js";
import importersRoute from "./routes/importers.js";
import statusRoute from "./routes/status.js";
import usersRoute from "./routes/users.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api", validationRoute);
app.use("/api", authRoute);
app.use("/api", catalogsRoute);
app.use("/api", declarationsRoute);
app.use("/api", exportersRoute);
app.use("/api", importersRoute);
app.use("/api", statusRoute);
app.use("/api", usersRoute);

export default app;
