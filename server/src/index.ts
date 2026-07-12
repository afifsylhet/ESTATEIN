import http from 'http';
import { inspect } from 'util';
import { createApp } from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { verifyEmailConnection } from './utils/mailer';

let server: http.Server | null = null;
let isShuttingDown = false;

function normalizeError(reason: unknown): Error {
  if (reason instanceof Error) return reason;
  return new Error(inspect(reason, { depth: 3 }));
}

function logUnhandledRejection(reason: unknown): void {
  // Some third-party libs (e.g. old promise stacks used by upload adapters) may
  // emit unhandled rejections for request-scoped failures that are still returned
  // to the client. Log loudly but don't kill the process.
  // eslint-disable-next-line no-console
  console.error('[UNHANDLED_REJECTION]', normalizeError(reason));
}

async function shutdown(trigger: string, err?: unknown): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  const hasError = Boolean(err);
  // eslint-disable-next-line no-console
  console.log(`\n${trigger} received. Shutting down gracefully...`);
  if (hasError) {
    // eslint-disable-next-line no-console
    console.error(`[FATAL] ${trigger}:`, normalizeError(err));
  }

  // Force-exit if graceful shutdown hangs
  const timeout = setTimeout(() => process.exit(1), 10_000);
  timeout.unref();

  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server!.close(() => resolve());
      });
    }
    await disconnectDB();
  } finally {
    clearTimeout(timeout);
    process.exit(hasError ? 1 : 0);
  }
}

function attachProcessHandlers(): void {
  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
  process.on('unhandledRejection', (reason) => {
    logUnhandledRejection(reason);
  });
  process.on('uncaughtException', (error) => {
    void shutdown('UncaughtException', error);
  });
}

async function bootstrap() {
  await connectDB();

  const app = createApp();
  server = http.createServer(app);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Estatein API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // Best-effort SMTP check so email misconfiguration surfaces at boot, not first send.
  void verifyEmailConnection();
}

attachProcessHandlers();

bootstrap().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start server:', err);
  if (server) {
    await new Promise<void>((resolve) => {
      server!.close(async () => {
        await disconnectDB();
        resolve();
      });
    });
  } else {
    try {
      await disconnectDB();
    } catch {
      // noop
    }
  }
  process.exit(1);
});
