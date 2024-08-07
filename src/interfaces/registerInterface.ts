import {IUser} from "./userInterface";

export interface IRegisterResponse {
    user: IUser;
    token: string;
}