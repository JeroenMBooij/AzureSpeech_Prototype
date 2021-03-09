import {Express, Request, Response, NextFunction} from 'express';

export default function useExceptionFilter(app: Express): void {

      // catch 404 and forward to error handler
    app.use((request: Request, response: Response, next: NextFunction) => {
        const error = new Error('404 Not Found');
        error['status'] = 404; 
        next(error);
    });

    // error handlers
    // error handler will print stacktrace only in development
    app.use((error: any, request: Request, response: Response) => {
        response.locals.message = error.message;
        response.locals.error = request.app.get('env') === 'development' ? error : {};
        response.status(error.status || 500);
        response.send(error.message);
    });

}