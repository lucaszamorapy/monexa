import fs from "fs/promises";
import path from "path";
import { IUploadFileInputDto } from "../../dto/upload/index.js";
import moment from "moment-timezone";
import nodemailer from 'nodemailer'
import { CustomError } from "../../errors/index.js";
import { resetPasswordTemplate } from "../../templates/emails/reset-password.js";
import { EmailTemplate, GenerateCodeVerificationOutputDto, SendEmailOptions } from "../../dto/global/index.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../users/index.js";
import { IUser } from "../../dto/users/index.js";
import { prisma } from "../../lib/db.js";

export class GeralService {
  static async uploadFile(params: IUploadFileInputDto): Promise<string> {
    const ext = path.extname(params.file.filename); // .png, .jpg
    const filename = `${params.id}${ext}`;

    const fullPath = path.join(process.cwd(), "uploads", params.pathFolder);
    await fs.mkdir(fullPath, { recursive: true });
    const uploadPath = path.join(fullPath, filename);
    try {
      await fs.unlink(uploadPath); // caso já tenha um arquivo existente
    } catch {
      // ignora — arquivo não existe ainda
    }

    const buffer = await params.file.toBuffer();
    await fs.writeFile(uploadPath, buffer);

    return `${params.pathFolder}/${filename}`;
  }

  static async deleteFolder(pathFolder: string): Promise<void> {
    const fullPath = path.join(process.cwd(), "uploads", pathFolder);

    try {
      await fs.rm(fullPath, { recursive: true, force: true });
    } catch (error) {
      throw new CustomError("Erro ao deletar arquivos", "BAD_REQUEST");
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
    }
  }

  static toBRDate(date: Date): string {
    return moment(date).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm:ss")
  }

  static async sendEmail(params: SendEmailOptions) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    const templates: Record<EmailTemplate, (data: any) => string> = {
      'reset-password': (data) => resetPasswordTemplate(data.name, data.codeVerification),
    }
    const html = templates[params.template](params.data)

    await transporter.sendMail({
      from: `"Taverna do Barik" <${process.env.SMTP_USER}>`,
      to: params.to,
      subject: params.subject,
      html,
    })
  }
  static generateCodeVerification(): GenerateCodeVerificationOutputDto {
    const codeVerification = crypto.randomInt(100000, 1000000);
    const expirationAt = new Date(Date.now() + 10 * 60 * 1000);
    return {
      codeVerification,
      expirationAt,
    }
  }
  static updateCreatedAt(): string {
    return moment(new Date()).tz("America/Sao_Paulo").format("yyyy-MM-dd HH:mm:ss");
  }
  static updateUpdatedAt(): string {
    return moment(new Date()).tz("America/Sao_Paulo").format("yyyy-MM-dd HH:mm:ss");
  }
  static async getUserFromToken(token: string): Promise<IUser> {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = typeof decoded.sub === "function"
      ? decoded.sub()
      : decoded.sub;
    if (!userId) {
      throw new CustomError("Token inválido", "BAD_REQUEST");
    }
    const user = await prisma.users.findFirst({ where: { userId: userId } });
    if (!user) {
      throw new CustomError("Usuário não encontrado", "NOT_FOUND");
    }
    return user;
  }
}