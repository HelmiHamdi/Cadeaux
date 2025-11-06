import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur SendGrid:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error("Erreur lors de l’envoi de l’email");
  }
};
