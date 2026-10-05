export interface User {
    _id: string;
    name : string;
    email : string;
    userType : 'student' | 'employed' | 'unemployed';
}

export interface LoginResponse {
    success : boolean;
    messsage : string,
    data : {
        user : {
            user : User;
            token : string;
        }
    }
}