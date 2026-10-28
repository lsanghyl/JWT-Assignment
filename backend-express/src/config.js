import "dotenv/config";

const secret = process.env.JWT_SECRET;
if (typeof secret !== "string" || !/^[0-9a-fA-F]{64}$/.test(secret)) {
  throw new Error("JWT_SECRET에 새로 생성한 64자리 16진수 키를 설정하세요.");
}

const ttlText = process.env.TOKEN_TTL ?? "90";
const tokenTtl = Number(ttlText);
if (!/^[1-9]\d*$/.test(ttlText) || !Number.isSafeInteger(tokenTtl)) {
  throw new Error("TOKEN_TTL은 초 단위의 양의 정수여야 합니다.");
}

function setting(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value.trim()) throw new Error(`${name}은 비어 있을 수 없습니다.`);
  return value;
}

export const jwtConfig = Object.freeze({
  key: Buffer.from(secret, "hex"),
  issuer: setting("JWT_ISSUER", "webservice-class"),
  audience: setting("JWT_AUDIENCE", "board-api"),
  tokenTtl,
});
