export type EmailTemplate = 'reset-password'

export interface SendEmailOptions {
  to: string
  subject: string
  template: EmailTemplate
  data: Record<string, any>
}

export interface GenerateCodeVerificationOutputDto {
  codeVerification: number
  expirationAt: Date
}

export interface IMessageOutputDto {
  message: string;
}