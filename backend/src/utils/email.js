import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"🎁 Gift Game" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur lors de l’envoi de l’email:", error);
    if (error.response) console.error(error.response);
    throw new Error("Échec de l’envoi de l’email");
  }
};
