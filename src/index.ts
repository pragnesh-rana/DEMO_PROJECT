import { PORT } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { startServer } from "./core/server.js";

async function bootstrap() {
  await connectDB();
  startServer(PORT);
}

bootstrap();