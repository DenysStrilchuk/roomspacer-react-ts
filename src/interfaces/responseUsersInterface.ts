import {IUser} from "./userInterface";

export interface IResponseUsers {
    users: IUser[];
    token: string;
}