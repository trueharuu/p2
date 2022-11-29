import express from 'express';
import { WebSocketServer } from 'ws';

export const app = express();
export const ws = new WebSocketServer({ port: 8000 });
