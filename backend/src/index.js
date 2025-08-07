import express from 'express';
import cors from 'cors';
import connectDB from './db/index.js';
import apiRoutes from './routes/api.route.js';
import healthcheckController from './controllers/healthcheck.controller.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({limit: "16kb"}));

app.use('/api', apiRoutes);
app.get('/health', healthcheckController);

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("Error starting server:", err);
});