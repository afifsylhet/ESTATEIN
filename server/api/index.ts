import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    const [{ connectDB }, { app }] = await Promise.all([import('../src/config/db'), import('../src/app')]);
    await connectDB();
    app(req, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Serverless function failed to initialize:', error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
