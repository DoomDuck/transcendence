import { Request } from "express";
import { UserDto } from "./user.dto";

import { idnumber } from "../customType";
interface RequestWithUser extends Request {
  //might be needed later
  // user: UserDto;
  id: idnumber;
}

export default RequestWithUser;
