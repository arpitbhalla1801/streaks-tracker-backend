import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendReminderEmail(platform: string, username: string) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Coding Streak Reminder - ${platform}`,
        text: `Hi ${username},\n\nDon\'t forget to complete your daily challenge on ${platform} to maintain your streak!\n\nHappy Coding!\n`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent for ${platform} to ${username}`);
    } catch (error) {
        console.error(`Error sending email for ${platform}:`, error);
    }
}
