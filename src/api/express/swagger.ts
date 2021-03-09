import { Express } from 'express';
import * as swaggerUi from 'swagger-ui-express';

export default function useSwagger(app: Express): void {

    var options = {
        swaggerOptions: {
          url: '/swagger.json'
        }
    }

    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, options));

}