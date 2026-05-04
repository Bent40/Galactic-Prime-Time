const logger = require('../logger');

// Skip noisy health-check pings from the connectivity probe
const SKIP = new Set(['/api/health']);

module.exports = function requestLogger(req, res, next) {
  if (SKIP.has(req.path)) return next();

  const start = Date.now();
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?')
    .split(',')[0].trim();

  res.on('finish', () => {
    const ms    = Date.now() - start;
    const code  = res.statusCode;
    const level = code >= 500 ? 'error' : code >= 400 ? 'warn' : 'http';
    logger[level](`${req.method.padEnd(6)} ${req.originalUrl.padEnd(45)} ${code}  ${ms}ms  ← ${ip}`);
  });

  next();
};
