import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config(); // ⚡ Charger les variables

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Email envoyé à ${to}`);
    console.log(response.data); // Pour debug
  } catch (error) {
    console.error("❌ Erreur Resend:", error.message);
    if (error.response) {
      console.error(error.response);
    }
    throw new Error("Erreur lors de l’envoi de l’e-mail");
  }
};
