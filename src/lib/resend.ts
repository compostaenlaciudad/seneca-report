import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCandidateAlert({
  to,
  candidateName,
  flagDescription,
  profileUrl,
}: {
  to: string
  candidateName: string
  flagDescription: string
  profileUrl: string
}) {
  return resend.emails.send({
    from: 'alertas@seneca.lat',
    to,
    subject: `Alerta: nuevo registro sobre ${candidateName}`,
    html: `
      <p>Se detectó una nueva alerta en el perfil de <strong>${candidateName}</strong>:</p>
      <blockquote>${flagDescription}</blockquote>
      <p><a href="${profileUrl}">Ver perfil completo →</a></p>
      <hr/>
      <p style="font-size:12px;color:#666">
        Recibes este correo porque sigues a este candidato en SENECA.
        <a href="${profileUrl}/unsubscribe">Cancelar seguimiento</a>
      </p>
    `
  })
}

export async function notifyEditorsNewReport({
  journalistName,
  candidateName,
  reportTitle,
  reviewUrl,
}: {
  journalistName: string
  candidateName: string
  reportTitle: string
  reviewUrl: string
}) {
  return resend.emails.send({
    from: 'editorial@seneca.lat',
    to: 'editores@seneca.lat',
    subject: `Nuevo reporte: "${reportTitle}" — ${candidateName}`,
    html: `
      <p><strong>${journalistName}</strong> envió un nuevo reporte:</p>
      <p><em>${reportTitle}</em> sobre ${candidateName}</p>
      <p><a href="${reviewUrl}">Revisar y aprobar →</a></p>
    `
  })
}