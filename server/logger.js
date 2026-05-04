const path   = require('path');
const fs     = require('fs');
const winston = require('winston');
const { combine, colorize, timestamp, printf, errors, json } = winston.format;

// ── Ensure logs/ directory exists ────────────────────────────────────────────
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

// ── Custom colour palette ────────────────────────────────────────────────────
winston.addColors({
  error: 'bold red',
  warn:  'bold yellow',
  info:  'bold cyan',
  http:  'magenta',
  debug: 'dim white',
});

// ── Custom levels (adds 'http' between info and debug) ───────────────────────
const LEVELS = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };

// ── Console format (coloured, human-readable) ─────────────────────────────────
const consoleLine = printf(({ timestamp: ts, level, message, stack, ...meta }) => {
  const extras = Object.keys(meta).length ? '  ' + JSON.stringify(meta) : '';
  const trace  = stack ? `\n  ${stack}` : '';
  return `[${ts}] ${level.padEnd(18)} ${message}${extras}${trace}`;
});

const consoleFormat = combine(
  errors({ stack: true }),
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  consoleLine,
);

// ── File format (no colour, full timestamp, JSON for error log) ──────────────
const fileLine = printf(({ timestamp: ts, level, message, stack, ...meta }) => {
  const extras = Object.keys(meta).length ? '  ' + JSON.stringify(meta) : '';
  const trace  = stack ? `\n  ${stack}` : '';
  return `[${ts}] ${level.toUpperCase().padEnd(7)} ${message}${extras}${trace}`;
});

const fileFormat = combine(
  errors({ stack: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  fileLine,
);

const errorFileFormat = combine(
  errors({ stack: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  json(),   // structured JSON for errors — easy to grep / parse
);

// ── Transports ────────────────────────────────────────────────────────────────
const transports = [
  // Console — coloured, http-level and above
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // combined.log — all messages (http and above), plain text, rotates at 5 MB, keeps 5 files
  new winston.transports.File({
    filename:  path.join(LOG_DIR, 'combined.log'),
    format:    fileFormat,
    maxsize:   5 * 1024 * 1024,   // 5 MB
    maxFiles:  5,
    tailable:  true,
  }),

  // error.log — only errors, JSON so they're easy to parse / search
  new winston.transports.File({
    filename:  path.join(LOG_DIR, 'error.log'),
    level:     'error',
    format:    errorFileFormat,
    maxsize:   2 * 1024 * 1024,   // 2 MB
    maxFiles:  10,
    tailable:  true,
  }),
];

// ── Logger instance ───────────────────────────────────────────────────────────
const logger = winston.createLogger({
  levels: LEVELS,
  level:  process.env.LOG_LEVEL || 'http',
  transports,
  // Catch unhandled exceptions / rejections into the error log
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'exceptions.log'),
      format:   errorFileFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'exceptions.log'),
      format:   errorFileFormat,
    }),
  ],
});

module.exports = logger;
