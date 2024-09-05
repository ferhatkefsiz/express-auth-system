import { Resend } from "resend"
import dotenv from "dotenv"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY || "resend_api_key")

export const sendVerificationEmail = async ({
  name,
  email,
  verificationCode
}: {
  name: string
  email: string
  verificationCode: string
}): Promise<void> => {
  try {
    const res = await resend.emails.send({
      from: `"Onboarding" <${process.env.EMAIL_SENDER}>`,
      // for production, you should use the email address of the user  who is registering instead of the hardcoded email address
      // to: [email],
      to: [process.env.EMAIL_RECIPIENT || "recipient_email"],
      subject: "Verify your email",
      html: `Hello ${name}, <br><br>Please verify your email by using this code:<br><br> <strong>${verificationCode}</strong>`
    })

    console.log("Email sent successfully", res)
  } catch (error) {
    throw new Error(`Email could not be sent ${error}`)
  }
}

export const sendWelcomeOnboardEmail = async ({ email, name }: { email: string; name: string }): Promise<void> => {
  try {
    const res = await resend.emails.send({
      from: `"Onboarding" <${process.env.EMAIL_SENDER}>`,
      // for production, you should use the email address of the user  who is registering instead of the hardcoded email address
      // to: [email],
      to: [process.env.EMAIL_RECIPIENT || "recipient_email"],
      subject: "Welcome onboard",
      html: `Hello ${name} - ${email},<br><br> your email has been <strong>verified!</strong> 🎉`
    })

    console.log("Email sent successfully", res)
  } catch (error) {
    throw new Error(`Email could not be sent ${error}`)
  }
}
