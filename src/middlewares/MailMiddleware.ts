const nodemailer = require("nodemailer");
import { Request, Response, NextFunction } from "express";
import config from "../config";
import UserSchema from "../database/Schemas/UserSchema";
import MailI from "../interfaces/Mail.interface";

class Mail implements MailI {
    private static myMail = nodemailer.createTransport({
        host: config.nodeMail.host,
        port: config.nodeMail.port,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: config.nodeMail.login,
            pass: config.nodeMail.password,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    private static setRecoverPasswordMailMessage = (
        email: string,
        code: string
    ) => {
        const message = {
            from: "noreply DeltaStorm <noreply@deltastorm.pl>",
            to: `${email}`,
            subject: "Odzysaj hasło",
            html: `
        <html>
        <body>
        <p>Odzyskaj swoje hasło</p><br/>
        <p style="font-size: 20px;">Twój kod:  <span style="font-weight=bold;">${code}</span></p>
        </body>
        </html>
        `,
        };
        Mail.myMail.sendMail(message, (error: any) => {
            if (error) {
                return console.log(error);
            }
            return true;
        });
    };

    private static setVerifyMailMessage = (email: string, code: string) => {
        const message = {
            from: "noreply DeltaStorm <noreply@deltastorm.pl>",
            to: `${email}`,
            subject: "Weryfikacja konta",
            html: `
        <html>
        <body>
        <p>Zweryfikuj swoje konto</p><br/>
        <p style="font-size: 20px;">Twój kod weryfikacji:  <span style="font-weight=bold;">${code}</span></p>
        </body>
        </html>
        `,
        };
        Mail.myMail.sendMail(message, (error: any) => {
            if (error) {
                return console.log(error);
            }
            return true;
        });
    };
    public async sendRecoverPasswordMail(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.body.secure.id;
        const code = req.body.secure.code;
        const user = await UserSchema.findOne({ id }, "email");
        const email = user.get("email");
        Mail.setRecoverPasswordMailMessage(email, code);
        next();
    }

    public async sendVerifyMail(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.body.secure.id;
        const code = req.body.secure.code;
        const user = await UserSchema.findOne({ id }, "email");
        const email = user.get("email");
        Mail.setVerifyMailMessage(email, code);
        next();
    }
}

export default new Mail();
