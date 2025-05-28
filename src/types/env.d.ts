/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_CLIENT_ID?: string;
    API_BASE_URL?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 