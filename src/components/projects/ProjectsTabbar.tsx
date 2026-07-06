interface ProjectsTabbarProps {
    selectedTab: "software" | "uiux" | "animation"
    onChangeTab: (tab: ProjectsTabbarProps['selectedTab']) => void
}

const tabs = [
    { key: 'software', label: 'Software' },
    { key: 'uiux', label: 'UI/UX Design' },
    { key: 'animation', label: '3d & Animation' },
] as const

export default function ProjectsTabbar({ selectedTab, onChangeTab }: ProjectsTabbarProps) {
    return (
        <section>
            <div className="flex justify-between md:text-lg font-bold md:max-w-lg p-5 md:p-8">
                {/* <div className="border-b-2 border-white p-2">Software</div>
                <div className="p-2">UI/UX Design</div>
                <div className="p-2">3d Animation</div> */}
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type='button'
                        onClick={() => onChangeTab(tab.key)}
                        className={`p-2 transition ${
                            selectedTab===tab.key
                                ? 'border-b-2 border-white'
                                : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </section>
    )
}