interface secureI {
    password_salt: String;
    id_salt: String;
    token_salt: String;
}

interface nodeMailI {
    host: String;
    port: String;
    login: String;
    password: String;
}

interface DBI {
    host: string;
    local: String;
}

export default interface configI {
    PORT: number;
    secure: secureI;
    nodeMail: nodeMailI;
    DB: DBI;
}
