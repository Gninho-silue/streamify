import {LANGUAGE_TO_FLAG} from "../constants/index.js";

export const getLanguageFlag = (language) => {
    if (!language) return null

    const langKey = language.toLowerCase()
    const countryCode = LANGUAGE_TO_FLAG[langKey] || null
    if (!countryCode) return null

    return (
        <img
            src={`https://flagcdn.com/w20/${countryCode}.png`}
            alt={`Flag of ${language}`}
            className="inline-block w-4 h-4 mr-1.5 rounded-sm"
            onError={(e) => {
                e.target.style.display = "none"
            }}
        />
    )
}