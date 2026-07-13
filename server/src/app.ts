import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env, isProd } from './config/env';
import { globalLimiter } from './middleware/rateLimiter';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import propertyRoutes from './modules/property/property.routes';
import categoryRoutes from './modules/category/category.routes';
import reviewRoutes from './modules/review/review.routes';
import favoriteRoutes from './modules/favorite/favorite.routes';
import inquiryRoutes from './modules/inquiry/inquiry.routes';
import contactRoutes from './modules/contact/contact.routes';
import blogRoutes from './modules/blog/blog.routes';
import testimonialRoutes from './modules/testimonial/testimonial.routes';
import newsletterRoutes from './modules/newsletter/newsletter.routes';
import statsRoutes from './modules/stats/stats.routes';
import uploadRoutes from './modules/upload/upload.routes';

export function createApp(): Application {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());
  if (!isProd) {
    app.use(morgan('dev'));
  }
  app.use(globalLimiter);

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Estatein API is healthy', timestamp: new Date().toISOString() });
  });

  const API_PREFIX = '/api/v1';
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  app.use(`${API_PREFIX}/properties`, propertyRoutes);
  app.use(`${API_PREFIX}/categories`, categoryRoutes);
  app.use(`${API_PREFIX}/reviews`, reviewRoutes);
  app.use(`${API_PREFIX}/favorites`, favoriteRoutes);
  app.use(`${API_PREFIX}/inquiries`, inquiryRoutes);
  app.use(`${API_PREFIX}/contact`, contactRoutes);
  app.use(`${API_PREFIX}/blogs`, blogRoutes);
  app.use(`${API_PREFIX}/testimonials`, testimonialRoutes);
  app.use(`${API_PREFIX}/newsletter`, newsletterRoutes);
  app.use(`${API_PREFIX}/stats`, statsRoutes);
  app.use(`${API_PREFIX}/upload`, uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
