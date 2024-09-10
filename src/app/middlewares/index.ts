import { Authenticate } from "./Authenticate";
import { HTTPRequestLogger } from "./HTTPRequestLogger";
import { HTTPResponseLogger } from "./HTTPResponseLogger";
import { IsValidId } from "./IsValidId";

type Middleware =
  | typeof HTTPRequestLogger
  | typeof HTTPResponseLogger
  | typeof Authenticate
  | typeof IsValidId;

const middlewares = <Middleware[]>[
  HTTPRequestLogger,
  HTTPResponseLogger,
  Authenticate,
  IsValidId,
];

export { middlewares };
