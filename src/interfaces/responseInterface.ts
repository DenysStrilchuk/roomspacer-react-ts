import {IUser} from "./userInterface";

export interface IResponse {
    user: IUser;
    token: string;
}