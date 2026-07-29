// Options for the "Get a quote" drawer. Kept here (not in the component) so the copy can be
// tuned without touching form logic, and so the API route can validate against the same lists.

export const services = [
    'Software Development',
    'UI/UX Design',
    '3D & Animation',
    'Other',
] as const

// Only shown once "Software Development" is selected — mirrors Project['subCategory'].
export const platforms = ['Mobile', 'Web', 'Desktop', 'IoT / Embedded'] as const

export const projectStages = [
    'Just an idea',
    'Have a brief / spec',
    'Designs ready',
    'Existing product to improve',
] as const

export const designStatus = ['Yes, I have designs', 'No, I need design', 'I am a designer'] as const

export const budgets = [
    'Under $1k',
    '$1k – $5k',
    '$5k – $15k',
    '$15k+',
    'Not sure yet',
] as const

export const timelines = ['ASAP', '1–3 months', '3–6 months', 'Flexible'] as const

// Upload limits. Mirrored in the API route — keep the two in sync.
export const MAX_FILE_BYTES = 10 * 1024 * 1024        // 10MB per file
export const MAX_TOTAL_BYTES = 25 * 1024 * 1024       // 25MB per submission
export const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.pdf,.zip,.fig'

export type QuoteField =
    | 'services'
    | 'platforms'
    | 'stage'
    | 'design'
    | 'budget'
    | 'timeline'
    | 'brief'
    | 'links'
    | 'fullName'
    | 'company'
    | 'email'
    | 'phone'
    | 'location'
