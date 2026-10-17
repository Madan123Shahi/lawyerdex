process.env.MONGODB_URI = "mongodb://127.0.0.1:1/x";
process.env.JWT_SECRET = "x".repeat(40);
const { createApp } = await import("/home/claude/lawyerdex/server/src/app.js");
const { signToken } = await import("/home/claude/lawyerdex/server/src/utils/token.js");
const server = createApp().listen(0);
const base = `http://127.0.0.1:${server.address().port}/api`;
const call = async (path, opts = {}) => {
  const r = await fetch(base + path, opts);
  let b = null; try { b = await r.json(); } catch {}
  return [r.status, b];
};
const json = (body, extra = {}) => ({ method: "POST", headers: { "Content-Type": "application/json", ...extra }, body: JSON.stringify(body) });
const adminCookie = "ld_token=" + signToken({ _id: "64b000000000000000000001", role: "admin" });
const clientCookie = "ld_token=" + signToken({ _id: "64b000000000000000000002", role: "client" });

const checks = [
  ["health", await call("/health"), 200],
  ["unknown route -> 404", await call("/nope"), 404],
  ["register invalid email/pw -> 400", await call("/auth/register", json({ name: "A", email: "bad", password: "123" })), 400],
  ["register cannot self-assign admin -> 400", await call("/auth/register", json({ name: "Eve Mallory", email: "e@x.com", password: "longenough1", role: "admin" })), 400],
  ["login missing fields -> 400", await call("/auth/login", json({})), 400],
  ["me without cookie -> 401", await call("/auth/me"), 401],
  ["lawyer profile without cookie -> 401", await call("/lawyers/me/profile"), 401],
  ["admin list without cookie -> 401", await call("/admin/lawyers"), 401],
  ["admin list as client -> 403", await call("/admin/lawyers", { headers: { cookie: clientCookie } }), 403],
  ["search bad query -> 400", await call("/lawyers?limit=999"), 400],
  ["search bad sort -> 400", await call("/lawyers?sort=evil"), 400],
  ["consultation invalid body -> 400", await call("/consultations", json({ lawyerSlug: "x", name: "A", email: "nope", message: "hi" })), 400],
  ["review as guest -> 401", await call("/lawyers/some-slug/reviews", json({ rating: 5 })), 401],
  ["tampered cookie -> 401", await call("/auth/me", { headers: { cookie: adminCookie.slice(0, -3) + "abc" } }), 401],
];
let fail = 0;
for (const [name, [status, body], want] of checks) {
  const ok = status === want; if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  (got ${status}${ok ? "" : ", want " + want})`);
}
const [, reg] = checks[2][1];
console.log("validation details sample:", JSON.stringify(reg.error.details));
server.close();
console.log(fail ? `${fail} FAILED` : "ALL PASSED");
process.exit(fail ? 1 : 0);
