import { Id } from "../customType";
export class UserDto {
constructor(
	public id:Id,
	public name:string,
	public socketId:string,
)
{
	this.id = id;
	this.name = name;
	this.socketId = socketId ;
		
}
}
