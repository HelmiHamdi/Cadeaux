import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // utilisation de SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // pour éviter certains blocages côté hébergement
      },
    });

    const mailOptions = {
      from: `"🎁 Gift Game" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé avec succès :", info.response);
  } catch (error) {
    console.error("❌ Erreur lors de l’envoi de l’email :", error.message);
    throw new Error("Erreur lors de l’envoi de l’email");
  }
};
