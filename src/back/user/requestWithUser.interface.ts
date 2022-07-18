import { Request } from "express";
import { UserDto } from "./user.dto";

interface RequestWithUser extends Request {
  	//might be needed later
	// user: UserDto;
  id: number;
}

export default RequestWithUser;
