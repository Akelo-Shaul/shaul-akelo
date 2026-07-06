import { UIUXSection } from "@/data/projects"

type Props = {
    section: UIUXSection
}

const sectionTitles: Record<Exclude<UIUXSection['type'], 'screen'>, string> = {
    problem: 'Problem',
    solution: 'Solution',
    myRole: 'My Role',
    designApproach: 'Design Approach',
    result: 'Result',
}

export default function CaseSections({ section }: Props) {
    // Handle screen sections - show name as title, no separate section title
    if (section.type === 'screen') {
        return (
            <>
                <div className="max-w-3xl">
                    <h2 className="text-5xl uppercase">{section.name}</h2>
                    <p className="text-xl text-gray-300 mt-4">{section.description}</p>
                </div>
                {section.image && <img src={section.image} alt={section.name} className="mt-8 w-full h-96 object-cover rounded-lg" />}
            </>
        )
    }

    return (
        <>
            <div className="max-w-3xl">
                <h2 className="text-5xl uppercase">{sectionTitles[section.type]}</h2>
                <p className="text-xl text-gray-300 mt-4">{(section as any).body}</p>
            </div>
            {section.type === 'designApproach' && (section as any).image && (
                <img src={(section as any).image} alt="design approach" className="mt-8 w-full h-96 object-cover rounded-lg" />
            )}
        </>
    )
}