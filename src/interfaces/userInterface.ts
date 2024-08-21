export interface IUser {
    uid: string;
    name: string;
    email: string;
    position?: string;
    picture?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
