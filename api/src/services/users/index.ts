import "dotenv/config"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IAuthRefreshTokenOutputDto, ILoginInputDto, IRegisterUserInputDto, IRegisterUserOutputDto, IUpdateUserFullInputDto, IUpdateUserFullOutputDto, IUpdateUserImageInputDto, IUpdateUserImageOutputDto, IUpdateUserInputDto, IUpdateUserOutputDto, IUser } from "../../dto/users/index.js";
import { CustomError } from "../../errors/index.js";
import { prisma } from "../../lib/db.js";
import { GeralService } from "../global/index.js";
import { MultipartFile } from "@fastify/multipart";
import { IMessageOutputDto } from "../../dto/global/index.js";

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as
  | "3h"
  | number;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN as
  | "7d"
  | number;

export class UsersService {

  async register(dto: IRegisterUserInputDto): Promise<IRegisterUserOutputDto> {
    let imageUrl: string | null = null
    const userExist = await prisma.users.findFirst({ where: { email: dto.email } })
    if (userExist) {
      throw new CustomError("Usuário já cadastrado", "BAD_REQUEST")
    }
    const hashedPassword = await bcrypt.hash(
      dto.password,
      10
    );
    const createdUser = await prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        image: null, // temporário
        createdAt: GeralService.updateCreatedAt(),
        updatedAt: GeralService.updateUpdatedAt(),
      },
    });

    if (dto.image) {
      imageUrl = await GeralService.uploadFile({
        file: dto.image as MultipartFile,
        id: createdUser.userId,
        pathFolder: `users/${createdUser.userId}/avatar`,
      })

      await prisma.users.update({
        where: { userId: createdUser.userId },
        data: { image: imageUrl },
      });
    }

    const accessToken = this.accessToken(createdUser)
    const refreshToken = this.refreshToken(createdUser)
    return {
      accessToken: accessToken!,
      refreshToken: refreshToken!,
      userId: createdUser.userId,
      name: createdUser.name,
      image: imageUrl,
      email: createdUser.email,
      message: `Bem-vindo(a) ${createdUser.name}`,
      createdAt: GeralService.toBRDate(new Date()),
      updatedAt: GeralService.toBRDate(new Date()),
    }
  }

  async login(dto: ILoginInputDto): Promise<IRegisterUserOutputDto> {
    const userExist = await prisma.users.findFirst({ where: { email: dto.email } })
    if (!userExist) {
      throw new CustomError("Usuário não encontrado", "NOT_FOUND")
    }
    const isValidPassword = await bcrypt.compare(dto.password, userExist.password);
    if (!isValidPassword) {
      throw new CustomError("E-mail ou senha inválidos", "BAD_REQUEST");
    }
    const accessToken = this.accessToken(userExist)
    const refreshToken = this.refreshToken(userExist)
    return {
      accessToken: accessToken!,
      refreshToken: refreshToken!,
      userId: userExist.userId,
      name: userExist.name,
      image: userExist.image,
      email: userExist.email,
      message: `Bem-vindo(a) novamente, ${userExist.name}`,
      createdAt: GeralService.toBRDate(userExist.createdAt),
      updatedAt: GeralService.toBRDate(userExist.updatedAt),
    }
  }

  async updateUser(dto: IUpdateUserInputDto): Promise<IUpdateUserOutputDto> {
    const findUser = await prisma.users.findFirst({ where: { userId: dto.userId } })
    if (!findUser) {
      throw new CustomError("Usuário não encontrado", "NOT_FOUND")
    }
    const password = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : findUser.password;

    const userUpdated = await prisma.users.update({
      where: { userId: dto.userId },
      data: {
        ...dto,
        password,
        updatedAt: GeralService.updateUpdatedAt(),
      },
    });
    return {
      name: userUpdated.name,
      email: userUpdated.email,
    }
  }

  async updateUserImage(dto: IUpdateUserImageInputDto): Promise<IUpdateUserImageOutputDto> {
    const imageUrl = await GeralService.uploadFile({
      file: dto.image,
      id: dto.userId,
      pathFolder: `users/${dto.userId}/avatar`,
    });

    await prisma.users.update({
      where: { userId: dto.userId },
      data: { image: imageUrl, updatedAt: GeralService.updateUpdatedAt() },
    });

    return {
      image: imageUrl
    };
  }

  async updateUserFull(
    dto: IUpdateUserFullInputDto,
  ): Promise<IUpdateUserFullOutputDto> {
    const findUser = await prisma.users.findFirst({ where: { userId: dto.userId } })
    if (!findUser) {
      throw new CustomError("Usuário não encontrado", "NOT_FOUND")
    }
    const user = await this.updateUser({ userId: dto.userId, name: dto.name, email: dto.email, password: dto.password });
    let imageUrl: string | null = null;
    if (dto.image) {
      const { image } = await this.updateUserImage({ userId: dto.userId, image: dto.image });
      imageUrl = image;
    } else {
      imageUrl = findUser.image
    }
    return {
      ...user,
      image: imageUrl,
      message: "Usuário atualizado com sucesso"
    };
  }

  async deleteUser(userId: string): Promise<IMessageOutputDto> {
    const findUser = await prisma.users.findFirst({ where: { userId } })
    if (!findUser) {
      throw new CustomError("Usuário não encontrado", "NOT_FOUND")
    }
    await prisma.users.delete({ where: { userId } })
    if (findUser.image) {
      GeralService.deleteFolder(`users/${findUser.userId}`)
    }
    return {
      message: "Usuário excluído com sucesso"
    }
  }

  async sendEmailResetPassword(email: string): Promise<IMessageOutputDto> {
    const findUser = await prisma.users.findFirst({ where: { email } })
    if (!findUser) {
      throw new CustomError("Usuário não encontrado", "NOT_FOUND")
    }
    const { codeVerification, expirationAt } = GeralService.generateCodeVerification();
    await prisma.users.update({
      where: { userId: findUser.userId },
      data: { codeVerification, expirationAt },
    });
    await GeralService.sendEmail({
      to: findUser.email,
      subject: "Redefinição de senha",
      template: "reset-password",
      data: {
        name: findUser.name,
        codeVerification,
      },
    });
    return {
      message: "Código de verificação enviado com sucesso"
    }
  }

  async authRefreshToken(token: string): Promise<IAuthRefreshTokenOutputDto> {
    const valid = this.decodeToken(token, true);
    const userId = typeof valid.sub === "function"
      ? valid.sub()
      : valid.sub;
    if (!userId) {
      throw new CustomError("Token inválido", "BAD_REQUEST");
    }
    const user = await prisma.users.findFirst({ where: { userId: userId } });
    if (!user) {
      throw new CustomError("Usuário não encontrado", "NOT_FOUND");
    }
    const accessToken = this.accessToken(user)
    return {
      accessToken: accessToken,
      refreshToken: token,
      userId: user.userId,
      name: user.name,
      image: user.image,
      email: user.email,
      createdAt: GeralService.toBRDate(user.createdAt),
      updatedAt: GeralService.toBRDate(user.updatedAt),
    }
  }
  accessToken(user: IUser) {
    const accessToken = jwt.sign(
      { sub: user.userId, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return accessToken
  }
  refreshToken(user: IUser) {
    const refreshToken = jwt.sign(
      { sub: user.userId },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
    return refreshToken
  }
  decodeToken(token: string, isRefresh: boolean = false) {
    const decoded = jwt.verify(token, !isRefresh ? JWT_SECRET : JWT_REFRESH_SECRET);
    return decoded;
  }
}