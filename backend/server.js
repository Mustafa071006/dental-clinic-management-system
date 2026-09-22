const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config/config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/examinations", require("./routes/examinationRoutes"));
app.use("/api/control-schedules", require("./routes/controlScheduleRoutes"));
app.use("/api/transfers", require("./routes/transferRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "GDCMS API is running",
  });
});

// Start Server
app.listen(config.server.port, () => {
  console.log(
    `GDCMS Server running on port ${config.server.port}`
  );
});