import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER, // API KEY de Brevo
        pass: process.env.SMTP_PASS, // API KEY también
    },
});

export const sendEmail = async (to: string, data: any) => {
    const { name, phone, guests, confirmed } = data;

    console.log(`📧 Intentando enviar correo a: ${to}`);
    console.log(`   Para invitado: ${name}`);

    const guestListHtml = guests.length
        ? guests
              .map(
                  (g: any) => `
            <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #444;">
                    • ${g.name}
                </td>
            </tr>`
              )
              .join("")
        : `
            <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #444;">
                    Sin invitados adicionales
                </td>
            </tr>`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitación</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f1ed; font-family: Georgia, serif;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f1ed">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <!-- Card principal -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" 
               style="background: #ffffff; border: 1px solid #e6dfd5; border-radius: 8px;">

          <!-- Encabezado decorado -->
          <tr>
            <td align="center" 
                style="padding: 40px 30px 20px; background: #faf7f3;
                       border-bottom: 1px solid #e6dfd5;">
              <h1 style="margin: 0; font-size: 28px; color: #5a4a42; letter-spacing: 1px;">
                Confirmación de Asistencia
              </h1>
              <p style="margin: 10px 0 0; font-size: 16px; color: #7a6a5c;">
                ¡Gracias por acompañarnos en este día tan especial!
              </p>
            </td>
          </tr>

          <!-- Cuerpo del mensaje -->
          <tr>
            <td style="padding: 35px 30px 25px; color: #5a4a42;">

              <p style="font-size: 18px; margin: 0 0 20px;">
                <strong>${name}</strong> ha confirmado su asistencia a la boda.
              </p>

              <p style="font-size: 16px; margin: 0 0 10px;">
                Teléfono de contacto: <strong>${phone || "No proporcionado"}</strong>
              </p>

              <p style="font-size: 16px; margin: 0 0 20px;">
                Estado: <strong>${confirmed ? "Confirmado ✓" : "No confirmado"}</strong>
              </p>

              <p style="font-size: 17px; margin: 0 0 10px;">
                Invitados adicionales:
              </p>

              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                ${guestListHtml}
              </table>

              <div style="text-align: center; margin-top: 30px;">
               <a href="${process.env.FRONTURL}/list"
                  style="background:#bfa980; padding:12px 28px; color:white; 
                         font-size:15px; text-decoration:none; border-radius:4px;">
                  Ver detalles del evento
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" 
                style="background:#faf7f3; padding: 20px; font-size: 12px; color: #8b7c70;">
              Este mensaje fue generado automáticamente. Si recibiste esto por error, ignóralo.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>

    `;

    const mailOptions = {
        from: `jerryrogers2305@gmail.com`,
        to,
        subject: "Confirmación de asistencia",
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Correo enviado exitosamente a ${to}`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}`);
        return info;
    } catch (error) {
        console.error(`❌ ERROR al enviar correo a ${to}:`);
        console.error(`   Invitado: ${name}`);
        console.error(`   Error completo:`, error);
        throw error;
    }
};
