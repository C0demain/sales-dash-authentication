import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "teamcodemain@gmail.com",
        pass: "thti zpiv ircu hkzu",
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: "teamcodemain@gmail.com",
      to,
      subject,
      text,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
