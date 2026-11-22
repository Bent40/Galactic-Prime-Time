// validate.js — turn bad input into a 400 with a message a person can act on.
//
// The pilot found three inputs that came back as a bare "Server error" 500: a
// username over the length limit, a username of only spaces, and a GM table
// name over 80 characters. In every case the database schema rejected the value
// and the route reported its own crash. These checks run BEFORE the write and
// mirror the schema limits (models/User.js, models/Table.js), so the two cannot
// disagree. Lengths are String.length, which is what Mongoose maxlength counts.

const USERNAME_MIN = 3;
const USERNAME_MAX = 32;
const PASSWORD_MIN = 6;
const TABLE_NAME_MAX = 80;
const TABLE_DESC_MAX = 500;

// → error string, or null when the value is fine
function usernameError(raw) {
  const u = typeof raw === 'string' ? raw.trim() : '';
  if (u.length < USERNAME_MIN || u.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters (spaces at the ends do not count)`;
  }
  return null;
}

function passwordError(raw) {
  if (typeof raw !== 'string' || raw.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters`;
  }
  return null;
}

function tableNameError(raw, { required = true } = {}) {
  if (raw == null) return required ? 'Table name is required' : null;
  const n = String(raw).trim();
  if (!n) return required ? 'Table name is required' : 'Table name cannot be empty';
  if (n.length > TABLE_NAME_MAX) return `Table name must be ${TABLE_NAME_MAX} characters or fewer (this one is ${n.length})`;
  return null;
}

function tableDescriptionError(raw) {
  if (raw == null) return null;
  const d = String(raw);
  if (d.length > TABLE_DESC_MAX) return `Description must be ${TABLE_DESC_MAX} characters or fewer (this one is ${d.length})`;
  return null;
}

// A Mongoose ValidationError that still slips through is the caller's fault,
// not the server's: report it as a 400 with the schema's own message.
function validationMessage(err) {
  if (!err || err.name !== 'ValidationError' || !err.errors) return null;
  const first = Object.values(err.errors)[0];
  return first?.message || 'Invalid input';
}

module.exports = {
  USERNAME_MIN, USERNAME_MAX, PASSWORD_MIN, TABLE_NAME_MAX, TABLE_DESC_MAX,
  usernameError, passwordError, tableNameError, tableDescriptionError, validationMessage,
};
