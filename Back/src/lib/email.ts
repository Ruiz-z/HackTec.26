import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_XXXXXXXXX')
const FROM = process.env.FROM_EMAIL || 'onboarding@resend.dev'

export async function sendPasswordReset(email: string, token: string): Promise<void> {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`

  const { error } = await resend.emails.send({
    from: `EcoArcade <${FROM}>`,
    to: email,
    subject: 'Recupera tu contraseña - EcoArcade',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #16a34a;">♻️ EcoArcade</h2>
        <p>Haz clic en el enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Restablecer contraseña
        </a>
        <p style="margin-top: 24px; color: #666;">Este enlace expira en 1 hora.</p>
        <p style="color: #999; font-size: 12px;">Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Error enviando email:', error)
    throw new Error('Error al enviar el email de recuperación')
  }
}
