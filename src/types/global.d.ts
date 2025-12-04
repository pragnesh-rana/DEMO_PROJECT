// Add global types or environment variable typing here if needed
declare namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      DATABASE_URL: string;
    }
  }