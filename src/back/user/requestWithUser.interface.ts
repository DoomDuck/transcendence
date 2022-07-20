import { Request } from "express";
import { UserDto } from "./user.dto";

import { Id } from "../customType";
interface RequestWithUser extends Request {
  //might be needed later
  // user: UserDto;
  id: Id;
}

export default RequestWithUser;
