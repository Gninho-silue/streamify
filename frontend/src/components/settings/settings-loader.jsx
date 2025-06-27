"use client"

import { Settings, Sparkles } from "lucide-react"

const SettingsLoader = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full">
        <div className="card-body text-center py-12">
          <div className="avatar placeholder mb-6">
            <div className="bg-primary text-primary-content rounded-full w-20 animate-pulse">
              <Settings className="w-10 h-10" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-spin" />
            <span className="loading loading-dots loading-lg text-primary"></span>
            <Sparkles className="w-5 h-5 text-secondary animate-spin" />
          </div>

          <h3 className="text-xl font-bold mb-2">Loading Settings</h3>
          <p className="text-base-content/70">Preparing your personalized settings panel...</p>

          {/* Skeleton content */}
          <div className="space-y-3 mt-8">
            <div className="skeleton h-4 w-3/4 mx-auto"></div>
            <div className="skeleton h-4 w-1/2 mx-auto"></div>
            <div className="skeleton h-4 w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsLoader
