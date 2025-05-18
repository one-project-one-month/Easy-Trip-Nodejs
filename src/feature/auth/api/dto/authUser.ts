export class AuthUser {
    id: string;
    name: string;
    verify: boolean;
    email: string;
    provider: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.verify = data.verify;
        this.provider = data.provider;

    }
}