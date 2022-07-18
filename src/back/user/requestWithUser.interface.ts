import { Request } from "express";
import { UserDto } from "./user.dto";

interface RequestWithUser extends Request {
  // user: UserDto;
  id: number;
}

export default RequestWithUser;
