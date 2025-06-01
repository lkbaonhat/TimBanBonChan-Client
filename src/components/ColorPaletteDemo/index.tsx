import React from 'react'

export default function ColorPaletteDemo() {
    // Color palette from our theme
    const colors = [
        { name: 'Deep Blue', hex: '#0052A3', class: 'bg-deepBlue', var: 'var(--deep-blue)', usage: 'Primary actions, headers' },
        { name: 'Medium Blue', hex: '#5B7CCB', class: 'bg-mediumBlue', var: 'var(--medium-blue)', usage: 'Secondary actions, highlights' },
        { name: 'Coral', hex: '#FF8A61', class: 'bg-coral', var: 'var(--coral)', usage: 'Call to actions, important elements' },
        { name: 'Soft Pink', hex: '#FFBDEF', class: 'bg-softPink', var: 'var(--soft-pink)', usage: 'Backgrounds, accents' },
        { name: 'Light Blue', hex: '#C4E2EF', class: 'bg-lightBlue', var: 'var(--light-blue)', usage: 'Backgrounds, cards' },
        { name: 'Light Lavender', hex: '#F1E9F2', class: 'bg-lavender', var: 'var(--light-lavender)', usage: 'Page backgrounds' }
    ]

    return (
        <div className="p-8 bg-lavender min-h-screen">
            <h1 className="text-3xl font-bold text-deepBlue mb-6">Color Palette</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors.map((color, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                        <div
                            className={`h-24 ${color.class} rounded-md mb-3`}
                            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
                        ></div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">{color.name}</h3>
                            <p className="text-sm">HEX: {color.hex}</p>
                            <p className="text-sm">Tailwind: <code>{color.class}</code></p>
                            <p className="text-sm">CSS Var: <code>{color.var}</code></p>
                            <p className="text-sm text-gray-600 mt-2">Suggested use: {color.usage}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-deepBlue mb-6">Example UI Components</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow space-y-4">
                        <h3 className="text-xl font-bold text-deepBlue">Buttons</h3>
                        <div className="flex flex-wrap gap-3">
                            <button className="bg-deepBlue text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                                Primary Button
                            </button>
                            <button className="bg-mediumBlue text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                                Secondary Button
                            </button>
                            <button className="bg-coral text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                                Accent Button
                            </button>
                            <button className="border border-deepBlue text-deepBlue px-4 py-2 rounded-md hover:bg-lightBlue">
                                Outline Button
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow space-y-4">
                        <h3 className="text-xl font-bold text-deepBlue">Cards</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-lightBlue rounded-md p-4">
                                <h4 className="font-medium text-deepBlue">Light Blue Card</h4>
                                <p className="text-sm text-gray-700">Background for information.</p>
                            </div>
                            <div className="bg-softPink rounded-md p-4">
                                <h4 className="font-medium text-deepBlue">Soft Pink Card</h4>
                                <p className="text-sm text-gray-700">Background for features.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold text-deepBlue mb-4">Alerts</h3>
                    <div className="space-y-4">
                        <div className="bg-lightBlue border-l-4 border-deepBlue p-4 rounded-r-md">
                            <h4 className="font-semibold text-deepBlue">Information Alert</h4>
                            <p className="text-sm">Using deep blue and light blue for information.</p>
                        </div>
                        <div className="bg-lavender border-l-4 border-mediumBlue p-4 rounded-r-md">
                            <h4 className="font-semibold text-mediumBlue">Success Alert</h4>
                            <p className="text-sm">Using medium blue and lavender for success.</p>
                        </div>
                        <div className="bg-softPink border-l-4 border-coral p-4 rounded-r-md">
                            <h4 className="font-semibold text-coral">Warning Alert</h4>
                            <p className="text-sm">Using coral and soft pink for warnings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
