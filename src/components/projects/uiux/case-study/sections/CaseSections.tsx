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
  if (section.type === 'screen') {
    return (
      <>
        <div className="max-w-3xl">
          <h2 className="text-5xl uppercase text-white">{section.name}</h2>
          <p className="text-xl text-gray-300 mt-4">{section.description}</p>
        </div>
        {section.image && (
          <img
            src={section.image}
            alt={section.name}
            className="mt-8 w-full h-96 object-cover rounded-lg"
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="max-w-3xl">
        <h2 className="text-5xl uppercase text-white">
          {sectionTitles[section.type]}
        </h2>
        <p className="text-xl text-gray-300 mt-4">{section.body}</p>
      </div>
      {section.type === 'designApproach' && section.image && (
        <img
          src={section.image}
          alt="design approach"
          className="mt-8 w-full h-96 object-cover rounded-lg"
        />
      )}
    </>
  )
}