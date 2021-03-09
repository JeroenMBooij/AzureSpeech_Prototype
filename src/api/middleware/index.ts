import { Express } from 'express';
import useExceptionFilter from './exception.middleware'

export default (app: Express): void => {
  useExceptionFilter(app);
  console.log('🚀 ExceptionFilter loaded.');
};