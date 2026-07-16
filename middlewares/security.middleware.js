import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

/**
 * Applies all baseline security middlewares in one place:
 * - helmet: secure HTTP headers
 * - mongoSanitize: strips $ and . operators from user input (NoSQL injection)
 * - xss-clean: sanitizes user input against XSS
 * - hpp: prevents HTTP parameter pollution
 */
const applySecurityMiddlewares = (app) => {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
};

export default applySecurityMiddlewares;
