import { useThemeStore } from '../store/useThemeStore'
import { PaletteIcon } from 'lucide-react';

import { THEMES } from '../constants';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (

    <div className='dropdown dropdown-end'>
      <button tabIndex={0} className='btn btn-ghost btn-circle'>
        <PaletteIcon className='size-5' />
      </button>
      <div tabIndex={0}
      className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg
      rounded-2xl w-56 border-base-content/10 max-h-80 overflow-auto'>
        <div className='space-y-1'>
          { THEMES.map((themeItem) => (
            <button
              key={themeItem.name}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
                ${theme === themeItem.name ? 'bg-primary/10 text-primary' : 'hover:bg-base/5'}`}
              onClick={() => setTheme(themeItem.name)}
            >
              <PaletteIcon className='size-4'/>
              <span className='text-sm'>{themeItem.label}</span>
              {/* Preview color */}
              <div className='ml-auto flex gap-1'>
                {themeItem.colors.map((color, index) => (
                  <div
                    key={index}
                    className='size-2 rounded-full'
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
