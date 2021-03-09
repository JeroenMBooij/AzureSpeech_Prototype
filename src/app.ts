import config from './api/build/config';
import * as express from 'express';

async function startServer() 
{
  const app = express();

  await require('./api/express').default(app);
  await require('./api/middleware').default(app);

  app.listen(config.port, () => 
  {
    console.log(`
      ################################################
      🛡️       Server listening on port: ${config.port}       🛡️ 
      ################################################
    `);
  });


}

startServer();