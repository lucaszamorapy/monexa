export const resetPasswordTemplate = (name: string, codeVerification: number) => {
  const codeString = String(codeVerification)
  const digits = codeString.split('')
  const currentYear = new Date().getFullYear();

  const digitBoxes = digits.map(d => `
    <span style="
      display: inline-block;
      width: 44px; height: 54px;
      background: #1d171f;
      border: 1.5px solid #f1b000;
      border-radius: 8px;
      font-size: 28px;
      font-weight: 700;
      color: #f1b000;
      line-height: 54px;
      text-align: center;
    ">${d}</span>
  `)

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0; padding:0; background:#f4f4f4; font-family: Arial, sans-serif;">
        <div style="max-width:600px; margin:40px auto;">

          <div style="background:#1d171f; padding:28px 24px; border-radius:8px 8px 0 0; text-align:center;">
            <p style="color:#f1b000; font-size:22px; font-weight:700; margin:0;">Taverna do Barik</p>
            <p style="color:#f1b000cc; font-size:13px; margin:4px 0 0;">Redefinição de senha</p>
          </div>

          <div style="background:#fff; padding:32px 24px;">
            <p style="color:#1f2937; font-size:18px; font-weight:700; margin:0 0 10px;">Olá, ${name}!</p>
            <p style="color:#4b5563; font-size:14px; line-height:1.6; margin:0 0 24px;">Use o código abaixo para redefinir sua senha. Digite-o na tela de verificação.</p>

            <div style="background:#1d171f; border:2px dashed #f1b000; border-radius:12px; padding:24px; text-align:center; margin:0 0 24px;">
              <p style="color:#f1b000; font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; margin:0 0 12px;">
                Seu código de verificação
              </p>

              <div style="text-align:center;">
                ${digitBoxes}
              </div>
            </div>

            <div style="background:#fff7ed; border-left:4px solid #f1b000; padding:12px 16px; border-radius:0 6px 6px 0;">
              <p style="color:#9a3412; font-size:13px; margin:0;">⚠️ Este código expira em <strong>10 minutos</strong> e só pode ser usado uma vez. Caso não tenha solicitado, ignore este e-mail.</p>
            </div>
          </div>

          <div style="background:#1d171f; border-radius:0 0 8px 8px; padding:16px 24px; text-align:center; border-top:1px solid #f1b00033;">
            <p style="color:#f1b000cc; font-size:11px; margin:0;">© ${currentYear} Taverna do Barik. Todos os direitos reservados.</p>
            <p style="color:#f1b000cc; font-size:11px; margin:4px 0 0;">Você está recebendo este e-mail pois solicitou a redefinição de senha.</p>
          </div>

        </div>
      </body>
    </html>
  `
}