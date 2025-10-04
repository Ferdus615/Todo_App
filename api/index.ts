import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// 1. Cache the server instance globally to reuse it across function calls
let cachedServer: any;

// 2. Main handler function required by Vercel's Node environment
export default async function handler(req: express.Request, res: express.Response) {
  if (!cachedServer) {
    // 3. Create the NestJS server instance only on the first cold start
    const expressApp = express();
    const server = await NestFactory.create(
      AppModule, 
      new ExpressAdapter(expressApp),
      {
        // Suppress logger to speed up cold start time
        logger: ['error', 'warn'], 
      }
    );
    
    // 4. Initialize the application
    await server.init();
    
    // Get the underlying express handler function
    const expressHandler = expressApp;
    cachedServer = expressHandler;
  }
  
  // 5. Forward the request to the cached express handler
  return cachedServer(req, res);
}