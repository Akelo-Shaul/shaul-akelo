import { MAX_FILE_BYTES, MAX_TOTAL_BYTES } from "@/data/quote"

// Quote submissions from the drawer. Email goes out via Resend's REST API over plain fetch —
// no SDK dependency to install or keep updated.
//
// Set these in the deploy environment (Vercel > Settings > Environment Variables):
//   RESEND_API_KEY  — required to actually send
//   QUOTE_TO_EMAIL  — where submissions land (defaults to the address below)
//   QUOTE_FROM_EMAIL— a sender on a domain you've verified with Resend
//
// Without RESEND_API_KEY the route still validates and returns 200, logging the submission to the
// server console. That keeps the form usable in local dev and stops a missing key from silently
// looking like a broken form to a visitor.

const TO = process.env.QUOTE_TO_EMAIL ?? 'shaulakelo@gmail.com'
const FROM = process.env.QUOTE_FROM_EMAIL ?? 'onboarding@resend.dev'

const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function POST(request: Request) {
    let form: FormData
    try {
        form = await request.formData()
    } catch {
        return Response.json({ error: 'Expected multipart form data.' }, { status: 400 })
    }

    const value = (key: string) => (form.get(key) as string | null)?.trim() ?? ''

    const fullName = value('fullName')
    const email = value('email')
    const brief = value('brief')

    // Re-validate server-side: the client checks are for UX, not trust.
    if (!fullName || !email || !brief) {
        return Response.json({ error: 'Name, email and project details are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ error: 'That email address looks invalid.' }, { status: 400 })
    }

    const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
    let total = 0
    for (const file of files) {
        if (file.size > MAX_FILE_BYTES) {
            return Response.json({ error: `"${file.name}" exceeds the per-file size limit.` }, { status: 413 })
        }
        total += file.size
    }
    if (total > MAX_TOTAL_BYTES) {
        return Response.json({ error: 'Attachments exceed the total size limit.' }, { status: 413 })
    }

    const rows: [string, string][] = [
        ['Name', fullName],
        ['Company', value('company')],
        ['Email', email],
        ['Phone', value('phone')],
        ['Location', value('location')],
        ['Services', value('services')],
        ['Platforms', value('platforms')],
        ['Stage', value('stage')],
        ['Designs', value('design')],
        ['Budget', value('budget')],
        ['Timeline', value('timeline')],
        ['Links', value('links')],
        ['Brief', brief],
    ].filter(([, v]) => v !== '') as [string, string][]

    const html = `<h2>New quote request</h2><table cellpadding="6">${rows
        .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`)
        .join('')}</table>`

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        console.warn('[quote] RESEND_API_KEY is not set — logging submission instead of emailing.')
        console.info('[quote]', Object.fromEntries(rows), `${files.length} attachment(s)`)
        return Response.json({ ok: true, delivered: false })
    }

    const attachments = await Promise.all(
        files.map(async (file) => ({
            filename: file.name,
            content: Buffer.from(await file.arrayBuffer()).toString('base64'),
        }))
    )

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: FROM,
            to: [TO],
            reply_to: email,
            subject: `Quote request — ${fullName}`,
            html,
            ...(attachments.length ? { attachments } : {}),
        }),
    })

    if (!res.ok) {
        const detail = await res.text().catch(() => '')
        console.error('[quote] Resend rejected the request:', res.status, detail)
        return Response.json({ error: 'Could not send right now. Please email me directly.' }, { status: 502 })
    }

    return Response.json({ ok: true, delivered: true })
}
