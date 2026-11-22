// test-validate.js — the 400-not-500 checks (Company Mode pilot finding 4).
// No DB, no node_modules. Run: node server/test-validate.js
const fs = require('fs');
const path = require('path');
const v = require('./utils/validate');

let pass = 0, fail = 0;
const eq = (label, got, want) => {
  if (got === want) pass++; else { fail++; console.log(`✗ ${label}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); }
};
const bad = (label, got) => { if (typeof got === 'string' && got) pass++; else { fail++; console.log(`✗ ${label}: expected an error message, got ${JSON.stringify(got)}`); } };

bad('blank username', v.usernameError('   '));
bad('2-char username', v.usernameError('ab'));
bad('33-char username', v.usernameError('a'.repeat(33)));
bad('non-string username', v.usernameError(42));
eq('3-char username is fine', v.usernameError('abc'), null);
eq('32-char username is fine', v.usernameError('a'.repeat(32)), null);
eq('ends are trimmed before counting', v.usernameError('  abc  '), null);
bad('5-char password', v.passwordError('12345'));
eq('6-char password is fine', v.passwordError('123456'), null);
bad('table name missing', v.tableNameError(undefined));
eq('table name optional on PATCH', v.tableNameError(undefined, { required: false }), null);
bad('blank table name on PATCH', v.tableNameError('  ', { required: false }));
bad('81-char table name', v.tableNameError('x'.repeat(81)));
eq('80-char table name is fine', v.tableNameError('x'.repeat(80)), null);
bad('501-char description', v.tableDescriptionError('x'.repeat(501)));
eq('no description is fine', v.tableDescriptionError(undefined), null);
eq('non-validation error is not a 400', v.validationMessage(new Error('boom')), null);
eq('validation error gives its message',
  v.validationMessage({ name: 'ValidationError', errors: { name: { message: 'too long' } } }), 'too long');

// Regression: routes/tables.js once CALLED these helpers without importing them.
// Every create threw a ReferenceError inside its own catch, which became an
// unhandled rejection and took the whole server down. Every route that uses a
// validate helper must import it.
for (const file of ['routes/tables.js', 'routes/auth.js']) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const imp = src.match(/const\s*\{([^}]*)\}\s*=\s*require\(['"]\.\.\/utils\/validate['"]\)/);
  const imported = new Set(imp ? imp[1].split(',').map(s => s.trim()).filter(Boolean) : []);
  for (const name of Object.keys(v).filter(k => typeof v[k] === 'function')) {
    if (new RegExp(`\\b${name}\\(`).test(src)) eq(`${file} imports ${name}`, imported.has(name), true);
  }
}

console.log(`\n${fail === 0 ? '✅' : '❌'} validate: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
