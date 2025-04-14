/// <reference types="vite/client" />

interface IResponse {
  code: number;
  message?: string;
  data?: any;
  [key: string]: any;
}