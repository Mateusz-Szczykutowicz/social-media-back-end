interface secure {
    password_salt: String;
    id_salt: String;
    token_salt: String;
}

export default interface config {
    PORT: number;
    secure: secure;
}
