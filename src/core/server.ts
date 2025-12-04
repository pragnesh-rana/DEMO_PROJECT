import { app } from "./app.js";

export function startServer(port: number | string) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}