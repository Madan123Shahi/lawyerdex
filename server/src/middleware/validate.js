import { ApiError } from "../utils/ApiError.js";

// Express 5 makes req.query read-only, so parsed values go on req.valid instead.
export const validate = (schemas) => (req, _res, next) => {
  req.valid = {};
  for (const part of ["body", "query", "params"]) {
    if (!schemas[part]) continue;
    const result = schemas[part].safeParse(req[part]);
    if (!result.success) {
      throw ApiError.badRequest(
        "Validation failed",
        result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      );
    }
    req.valid[part] = result.data;
  }
  next();
};
