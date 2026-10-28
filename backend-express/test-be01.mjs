import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import jwt from "jsonwebtoken";

const secret = randomBytes(32).toString("hex");
const env = { ...process.env, JWT_SECRET: secret, JWT_ISSUER: "webservice-class", JWT_AUDIENCE: "board-api", TOKEN_TTL: "3", PORT: "18081", DB_FILE: "../../work/be01-test.sqlite", DOTENV_CONFIG_PATH: "../../work/no-test-env" };
let checks = 0;
for (const invalid of [undefined, "", "REPLACE_WITH_RANDOM_64_HEX_CHARACTERS", "a".repeat(63), "g".repeat(64)]) {
  const testEnv = { ...env };
  if (invalid === undefined) delete testEnv.JWT_SECRET;
  else testEnv.JWT_SECRET = invalid;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", "import './src/config.js'"], { env: testEnv });
  assert.notEqual(result.status, 0);
  checks++;
}
for (const ttl of ["", "0", "-1", "1.5", "abc", "9007199254740992"]) {
  assert.notEqual(spawnSync(process.execPath, ["--input-type=module", "-e", "import './src/config.js'"], { env: { ...env, TOKEN_TTL: ttl } }).status, 0);
  checks++;
}
const defaults = { ...env };
delete defaults.TOKEN_TTL;
assert.equal(spawnSync(process.execPath, ["--input-type=module", "-e", "import {jwtConfig} from './src/config.js'; if(jwtConfig.tokenTtl!==90) process.exit(1)"], { env: defaults }).status, 0);
checks++;

const server = spawn(process.execPath, ["src/app.js"], { env, stdio: ["ignore", "pipe", "pipe"] });
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("server startup timeout")), 10000);
    server.once("exit", code => { clearTimeout(timeout); reject(new Error(`server exited: ${code}`)); });
    server.stdout.once("data", () => { clearTimeout(timeout); resolve(); });
  });
  for (const [email, id, name] of [["alice@class.test", 1, "Alice"], ["bob@class.test", 2, "Bob"]]) {
    const response = await fetch("http://127.0.0.1:18081/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "Classroom!2026" }) });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual(Object.keys(body).sort(), ["accessToken", "expiresIn", "user"]);
    assert.deepEqual(body.user, { id, name, email });
    assert.equal(body.expiresIn, 3);
    const decoded = jwt.verify(body.accessToken, Buffer.from(secret, "hex"), { algorithms: ["HS256"], issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, complete: true });
    assert.equal(decoded.header.alg, "HS256");
    assert.equal(decoded.payload.sub, String(id));
    assert.equal(decoded.payload.exp - decoded.payload.iat, 3);
    assert.deepEqual(Object.keys(decoded.payload).sort(), ["aud", "exp", "iat", "iss", "sub"]);
    assert.throws(() => jwt.verify(body.accessToken, Buffer.from(secret, "hex"), { clockTimestamp: decoded.payload.exp }), { name: "TokenExpiredError" });
    checks++;
  }
  const cases = [
    [{ email: "alice@class.test", password: "wrong" }, 401, "INVALID_CREDENTIALS"],
    [{ email: "missing@class.test", password: "Classroom!2026" }, 401, "INVALID_CREDENTIALS"],
    [{ email: "alice@class.test", password: " Classroom!2026 " }, 401, "INVALID_CREDENTIALS"],
    [{ email: "", password: "x" }, 400, "BAD_INPUT"],
    [{ email: "alice@class.test" }, 400, "BAD_INPUT"],
    [{ email: 1, password: "x" }, 400, "BAD_INPUT"],
    [{ email: "alice@class.test", password: " ".repeat(128) + "x" }, 400, "BAD_INPUT"],
    [{ email: "alice@class.test", password: "x", userId: 1 }, 400, "BAD_INPUT"],
    [[], 400, "BAD_INPUT"],
  ];
  for (const [input, status, code] of cases) {
    const response = await fetch("http://127.0.0.1:18081/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    assert.equal(response.status, status);
    const body = await response.json();
    assert.equal(body.code, code);
    assert.equal(typeof body.message, "string");
    assert.equal(body.accessToken, undefined);
    checks++;
  }
  console.log(`PASS: ${checks} BE-01 cases; no secrets or tokens logged.`);
} finally {
  server.kill();
}
