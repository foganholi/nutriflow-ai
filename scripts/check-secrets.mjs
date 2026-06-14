import { execFileSync } from "node:child_process";
const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
const forbidden = [
  /sb_secret_[A-Za-z0-9_-]{12,}/,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?[A-Za-z0-9._-]{12,}/i,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
];
let failed = false;
for (const file of tracked) {
  if (file === "package-lock.json" || file.startsWith(".git/")) continue;
  try {
    const text = execFileSync("git", ["show", `:${file}`], { encoding: "utf8", maxBuffer: 5_000_000 });
    for (const pattern of forbidden) if (pattern.test(text)) { console.error(`Possível segredo em ${file}: ${pattern}`); failed = true; }
  } catch { /* Binary or unreadable tracked files are ignored. */ }
}
if (failed) process.exit(1);
console.log("Nenhum padrão de segredo proibido foi encontrado em arquivos rastreados.");
