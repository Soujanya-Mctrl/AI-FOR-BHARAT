import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

export const sanitizeMongoDB = mongoSanitize();
export const sanitizeXSS = xss();
