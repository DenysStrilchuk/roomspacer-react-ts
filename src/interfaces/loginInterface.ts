import {IUser} from "./userInterface";

export interface ILoginResponse {
    user: IUser;
    token: string;
}