export const resetPasswordTemplate = (
  name: string,
  codeVerification: number
) => {
  const codeString = String(codeVerification).padStart(6, "0");
  const digits = codeString.split("");
  const currentYear = new Date().getFullYear();

  const primaryColor = "#168567";
  const darkColor = "#10231D";

  const digitBoxes = digits
    .map(
      (digit) => `
        <span style="
          display: inline-block;
          width: 44px;
          height: 54px;
          background: ${darkColor};
          border: 1.5px solid ${primaryColor};
          border-radius: 8px;
          font-size: 28px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 54px;
          text-align: center;
          margin: 0 3px;
        ">${digit}</span>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Redefinição de senha | Monexa</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background: #F4F7F5;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          max-width: 600px;
          margin: 40px auto;
          padding: 0 12px;
        ">

          <!-- Cabeçalho -->
          <div style="
            background: ${darkColor};
            padding: 32px 24px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          ">
            <p style="
              color: #FFFFFF;
              font-size: 26px;
              font-weight: 700;
              letter-spacing: -0.8px;
              margin: 0;
            ">
              <span style="color: ${primaryColor};">M</span>onexa
            </p>

            <p style="
              color: #B7C9C1;
              font-size: 13px;
              margin: 8px 0 0;
            ">
              Redefinição de senha
            </p>
          </div>

          <!-- Conteúdo -->
          <div style="
            background: #FFFFFF;
            padding: 32px 24px;
          ">
            <p style="
              color: #17251F;
              font-size: 20px;
              font-weight: 700;
              margin: 0 0 12px;
            ">
              Olá, ${name}!
            </p>

            <p style="
              color: #53635B;
              font-size: 14px;
              line-height: 1.7;
              margin: 0 0 28px;
            ">
              Recebemos uma solicitação para redefinir a senha da sua conta.
              Utilize o código abaixo para continuar com segurança.
            </p>

            <!-- Código de verificação -->
            <div style="
              background: ${darkColor};
              border: 1px dashed ${primaryColor};
              border-radius: 12px;
              padding: 24px 12px;
              text-align: center;
              margin: 0 0 24px;
            ">
              <p style="
                color: #B7C9C1;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin: 0 0 18px;
              ">
                Seu código de verificação
              </p>

              <div style="text-align: center;">
                ${digitBoxes}
              </div>

              <p style="
                color: #B7C9C1;
                font-size: 12px;
                margin: 18px 0 0;
              ">
                Digite este código na tela de recuperação.
              </p>
            </div>

            <!-- Aviso -->
            <div style="
              background: #EDF7F2;
              border-left: 4px solid ${primaryColor};
              padding: 14px 16px;
              border-radius: 0 6px 6px 0;
            ">
              <p style="
                color: #245443;
                font-size: 13px;
                line-height: 1.6;
                margin: 0;
              ">
                <strong>Atenção:</strong> este código expira em
                <strong>10 minutos</strong> e só pode ser utilizado uma vez.
                Se você não solicitou a redefinição, ignore este e-mail.
              </p>
            </div>
          </div>

          <!-- Rodapé -->
          <div style="
            background: ${darkColor};
            border-top: 2px solid ${primaryColor};
            border-radius: 0 0 12px 12px;
            padding: 20px 24px;
            text-align: center;
          ">
            <p style="
              color: #FFFFFF;
              font-size: 12px;
              font-weight: 600;
              margin: 0;
            ">
              Monexa
            </p>

            <p style="
              color: #B7C9C1;
              font-size: 11px;
              line-height: 1.6;
              margin: 8px 0 0;
            ">
              Organize suas finanças. Planeje seu futuro.
            </p>

            <p style="
              color: #82968C;
              font-size: 10px;
              margin: 16px 0 0;
            ">
              © ${currentYear} Monexa. Todos os direitos reservados.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
};
