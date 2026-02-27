import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './routers';

const PORT = Number(process.env.PORT) || 3000;

function createServer() {
  return createHTTPServer({
    router: appRouter,
    responseMeta() {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    },
  });
}

function startServer() {
  const server = createServer();

  server.once('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      process.stderr.write(
        `Port ${PORT} is already in use. Close the process using that port or set PORT to another value.\n`
      );
      process.exit(1);
      return;
    }

    throw error;
  });

  server.listen(PORT, () => {
    console.log(`🦉 Noctua tRPC server listening on http://localhost:${PORT}`);
  });
}

startServer();
