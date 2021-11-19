interface secureI {
    password_salt: String;
    id_salt: String;
    token_salt: String;
}

export default interface configI {
    PORT: number;
    secure: secureI;
}
