import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const msg = {
      to,
      from: "helmihamdi977@gmail.com", // adresse d’expéditeur validée
      subject,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log("✅ Email envoyé avec succès à", to);
  } catch (error) {
    console.error("❌ Erreur d’envoi d’email :", error.response?.body || error);
    throw new Error("Erreur lors de l’envoi de l’email");
  }
};
