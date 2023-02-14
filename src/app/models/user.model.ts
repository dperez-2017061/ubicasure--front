export class UserModel{
    constructor(
        public _id: string,
        public name: string,
        public username: string,
        public password: string,
        public role: string
    ){}
}