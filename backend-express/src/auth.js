
import jwt from "jsonwebtoken";
import { jwtConfig } from "./config.js";
import { ApiError } from "./errors.js";
import { findPublic } from "./users.js";

export function issueToken(user) {
  return jwt.sign({}, jwtConfig.key, {
    algorithm: "HS256",
    subject: String(user.id),
    expiresIn: jwtConfig.tokenTtl,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  });
}

export function currentUserId(req) {
  const authorization = req.headers.authorization;

  // 1. Bearer 헤더 확인
  if (
    typeof authorization !== "string" ||
    !/^Bearer [^\s]+$/.test(authorization)
  ) {
    throw new ApiError(
      401,
      "TOKEN_REQUIRED",
      "Bearer 토큰이 필요합니다."
    );
  }

  const token = authorization.slice(7);

  try {
    // 2. 서명, 알고리즘, 만료, 발급자, 대상 검증
    const payload = jwt.verify(token, jwtConfig.key, {
      algorithms: ["HS256"],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });

    // 3. 필수 클레임 및 사용자 ID 검사
    if (
      typeof payload !== "object" ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub) ||
      !Number.isSafeInteger(Number(payload.sub)) ||
      typeof payload.exp !== "number" ||
      !Number.isSafeInteger(payload.exp) ||
      typeof payload.iss !== "string" ||
      typeof payload.aud !== "string"
    ) {
      throw new ApiError(
        401,
        "INVALID_TOKEN",
        "토큰 클레임이 올바르지 않습니다."
      );
    }

    const userId = Number(payload.sub);
    const user = findPublic(userId);

    if (!user) {
      throw new ApiError(
        401,
        "INVALID_TOKEN",
        "존재하지 않는 사용자입니다."
      );
    }

    // 4. 검증된 사용자 ID 반환
    return user.id;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(
        401,
        "TOKEN_EXPIRED",
        "토큰이 만료되었습니다."
      );
    }

    throw new ApiError(
      401,
      "INVALID_TOKEN",
      "유효하지 않은 토큰입니다."
    );
  }
}

export function assertOwner(userId, authorId) {
  if (userId !== authorId) {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "본인이 작성한 게시글만 수정하거나 삭제할 수 있습니다."
    );
  }
}
