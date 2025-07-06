"use client"

import {useState, useEffect, useRef} from "react"
import { toast } from "react-hot-toast"
import {
  Plus,
  X,
  Users,
  Globe,
  Lock,
  Sparkles,
  BookOpen,
  Shield,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Eye,
  EyeOff,
  Hash,
  Flag,
  Zap,
  Edit3,
  Save, UploadCloud, ImageIcon, Trash2, Info,
} from "lucide-react"
import {LANGUAGES} from "../../constants/index.js";
import {compressImage, formatFileSize, validateImageFile} from "../../utils/imageUtils.js";
import ImageUploadField from "./ImageUploadField";

const GroupForm = ({ mode, initialData = {}, onSubmit, isLoading = false, onCancel, onFormChange }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [templateApplied, setTemplateApplied] = useState(false)
  const [appliedTemplateName, setAppliedTemplateName] = useState("")
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    nativeLanguage: initialData.nativeLanguage || "",
    learningLanguage: initialData.learningLanguage || "",
    level: initialData.level || "all",
    maxMembers: initialData.maxMembers || 50,
    isPrivate: initialData.isPrivate || false,
    tags: initialData.tags || [],
    rules: initialData.rules || [],
    category: initialData.category || "general",
    image: initialData.image || null,
    coverImage: initialData.coverImage || null,
    meetingSchedule: initialData.meetingSchedule || "flexible",
  })
  const [newTag, setNewTag] = useState("")
  const [newRule, setNewRule] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(false)

  // Track unsaved changes
  useEffect(() => {
    const hasData = formData.name || formData.description || formData.tags.length > 0
    setHasUnsavedChanges(hasData && mode === "create")
  }, [formData, mode])

  

  // Form validation
  const validateStep = (step) => {
    const errors = {}

    if (step >= 1) {
      if (!formData.name.trim()) errors.name = "Group name is required"
      if (formData.name.length < 3) errors.name = "Group name must be at least 3 characters"
      if (!formData.description.trim()) errors.description = "Description is required"
      if (formData.description.length < 20) errors.description = "Description must be at least 20 characters"
    }

    if (step >= 2) {
      if (!formData.nativeLanguage) errors.nativeLanguage = "Native language is required"
      if (!formData.learningLanguage) errors.learningLanguage = "Learning language is required"
      if (formData.nativeLanguage === formData.learningLanguage) {
        errors.learningLanguage = "Learning language must be different from native language"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
      e.preventDefault()

      if (!validateStep(3)) {
        toast.error("Please fix the validation errors")
        return
      }

    // Create a clean data object for JSON submission
    const submissionData = {
      name: formData.name,
      description: formData.description,
      nativeLanguage: formData.nativeLanguage,
      learningLanguage: formData.learningLanguage,
      level: formData.level,
      maxMembers: formData.maxMembers,
      isPrivate: formData.isPrivate,
      tags: formData.tags,
      rules: formData.rules,
      category: formData.category,
      meetingSchedule: formData.meetingSchedule
    }

    // Convert image files to base64 strings
    if (formData.image) {
      submissionData.image = formData.image
    }
    if (formData.coverImage) {
      submissionData.coverImage = formData.coverImage
    }

    onSubmit(submissionData)
  }


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }))
    }
    if (typeof onFormChange === "function") onFormChange();
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
      toast.success("Tag added!")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const addRule = () => {
    if (newRule.trim() && !formData.rules.includes(newRule.trim()) && formData.rules.length < 10) {
      setFormData((prev) => ({ ...prev, rules: [...prev.rules, newRule.trim()] }))
      setNewRule("")
      toast.success("Rule added!")
    }
  }

  const removeRule = (ruleToRemove) => {
    setFormData((prev) => ({ ...prev, rules: prev.rules.filter((rule) => rule !== ruleToRemove) }))
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Si un template est appliqué et qu'on est à l'étape 2, passer directement à l'étape 3
      if (templateApplied && currentStep === 2) {
        setCurrentStep(3)
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 3))
      }
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getCompletionPercentage = () => {
    let completed = 0
    const total = templateApplied ? 6 : 8

    if (formData.name) completed++
    if (formData.description) completed++
    if (formData.nativeLanguage) completed++
    if (formData.learningLanguage) completed++
    if (formData.level !== "all") completed++
    if (templateApplied || formData.tags.length > 0) completed++
    if (templateApplied || formData.rules.length > 0) completed++
    if (formData.category !== "general") completed++

    return Math.round((completed / total) * 100)
  }
  const groupTemplates = [
    {
      name: "Conversation Practice",
      description: "A group focused on improving speaking skills through regular conversation sessions.",
      tags: ["conversation", "speaking", "practice"],
      rules: ["Speak only in the target language during sessions", "Be respectful and patient with all members"],
      category: "conversation",
    },
    {
      name: "Grammar Study Group",
      description: "Dedicated to mastering grammar rules and structures through collaborative learning.",
      tags: ["grammar", "study", "exercises"],
      rules: ["Share helpful resources", "Ask questions freely", "Help others with explanations"],
      category: "grammar",
    },
    {
      name: "Cultural Exchange",
      description: "Learn about different cultures while practicing languages with native speakers.",
      tags: ["culture", "exchange", "traditions"],
      rules: ["Share cultural insights respectfully", "Be open to different perspectives"],
      category: "cultural",
    },
    {
      name: "Business Language",
      description: "Professional language learning focused on business communication and terminology.",
      tags: ["business", "professional", "networking"],
      rules: ["Keep discussions professional", "Share business language resources", "Practice formal communication"],
      category: "business",
    },
  ]

  const applyTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      name: template.name,
      description: template.description,
      tags: [...template.tags],
      rules: [...template.rules],
      category: template.category,
    }))
    setTemplateApplied(true)
    setAppliedTemplateName(template.name)
    setEditingTemplate(false)
    toast.success(`✨ Template "${template.name}" applied!`)
  }

  const clearTemplate = () => {
    setTemplateApplied(false)
    setAppliedTemplateName("")
    setEditingTemplate(false)
    toast.info("Template cleared")
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information"
      case 2:
        return "Language Settings"
      case 3:
        return templateApplied && !editingTemplate ? "Final Settings" : "Customization"
      default:
        return mode === "create" ? "Create Group" : "Update Group"
    }
  }

  // For update mode, show all steps in one view
  if (mode === "update") {
    return (
        <div className="space-y-8">
          {/* Images Upload Section */}
                    <ImageUploadField
                      label="Cover Image"
                      description="This image will be displayed at the top of your group page"
                      value={formData.coverImage}
                      onChange={(img) => handleInputChange("coverImage", img)}
                      recommended="1200x800px, PNG/JPG/WebP, up to 5MB"
                      width={1200}
                      height={800}
                      quality={0.7}
                    />

                    <ImageUploadField
                      label="Group Profile Picture"
                      description="This will be displayed as your group's avatar"
                      value={formData.image}
                      onChange={(img) => handleInputChange("image", img)}
                      recommended="400x400px, PNG/JPG/WebP, up to 5MB"
                      width={400}
                      height={400}
                      quality={0.8}
                      rounded
                    />
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Update Group Settings
              </h2>
              <p className="text-base-content/70">Modify your group information and settings</p>
            </div>
            <button onClick={() => setShowPreview(!showPreview)} className="btn btn-outline btn-sm gap-2">
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-6">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="card-title text-xl">Basic Information</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          Group Name *{validationErrors.name && <AlertCircle className="w-4 h-4 text-error" />}
                        </span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Spanish Conversation Club"
                            className={`input input-bordered w-full transition-all ${
                                validationErrors.name ? "input-error" : "focus:input-primary"
                            }`}
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            maxLength={100}
                        />
                        <label className="label">
                        <span className={`label-text-alt ${validationErrors.name ? "text-error" : ""}`}>
                          {validationErrors.name || `${formData.name.length}/100`}
                        </span>
                        </label>
                      </div>

                      <div>
                        <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          Description *{validationErrors.description && <AlertCircle className="w-4 h-4 text-error" />}
                        </span>
                        </label>
                        <textarea
                            placeholder="Describe your group's purpose, goals, and what members can expect..."
                            className={`textarea textarea-bordered w-full h-32 transition-all ${
                                validationErrors.description ? "textarea-error" : "focus:textarea-primary"
                            }`}
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            maxLength={500}
                        />
                        <label className="label">
                        <span className={`label-text-alt ${validationErrors.description ? "text-error" : ""}`}>
                          {validationErrors.description || `${formData.description.length}/500`}
                        </span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">Category</span>
                          </label>
                          <select
                              className="select select-bordered w-full focus:select-primary"
                              value={formData.category}
                              onChange={(e) => handleInputChange("category", e.target.value)}
                          >
                            <option value="general">General Learning</option>
                            <option value="conversation">Conversation Practice</option>
                            <option value="grammar">Grammar Focus</option>
                            <option value="business">Business Language</option>
                            <option value="academic">Academic Preparation</option>
                            <option value="cultural">Cultural Exchange</option>
                          </select>
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text font-medium">Meeting Schedule</span>
                          </label>
                          <select
                              className="select select-bordered w-full focus:select-primary"
                              value={formData.meetingSchedule}
                              onChange={(e) => handleInputChange("meetingSchedule", e.target.value)}
                          >
                            <option value="flexible">Flexible Schedule</option>
                            <option value="daily">Daily Sessions</option>
                            <option value="weekly">Weekly Meetings</option>
                            <option value="biweekly">Bi-weekly Meetings</option>
                            <option value="monthly">Monthly Gatherings</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Language Settings */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-6">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <h3 className="card-title text-xl">Language Settings</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          Native Language *
                          {validationErrors.nativeLanguage && <AlertCircle className="w-4 h-4 text-error" />}
                        </span>
                        </label>
                        <select
                            className={`select select-bordered w-full transition-all ${
                                validationErrors.nativeLanguage ? "select-error" : "focus:select-primary"
                            }`}
                            value={formData.nativeLanguage}
                            onChange={(e) => handleInputChange("nativeLanguage", e.target.value)}
                        >
                          <option value="">Select native language</option>
                          {LANGUAGES.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          Learning Language *
                          {validationErrors.learningLanguage && <AlertCircle className="w-4 h-4 text-error" />}
                        </span>
                        </label>
                        <select
                            className={`select select-bordered w-full transition-all ${
                                validationErrors.learningLanguage ? "select-error" : "focus:select-primary"
                            }`}
                            value={formData.learningLanguage}
                            onChange={(e) => handleInputChange("learningLanguage", e.target.value)}
                        >
                          <option value="">Select learning language</option>
                          {LANGUAGES.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Target Level</span>
                        </label>
                        <select
                            className="select select-bordered w-full focus:select-primary"
                            value={formData.level}
                            onChange={(e) => handleInputChange("level", e.target.value)}
                        >
                          <option value="all">All Levels Welcome</option>
                          <option value="beginner">Beginner (A1-A2)</option>
                          <option value="intermediate">Intermediate (B1-B2)</option>
                          <option value="advanced">Advanced (C1-C2)</option>
                        </select>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Maximum Members</span>
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                              type="range"
                              min="5"
                              max="100"
                              className="range range-primary flex-1"
                              value={formData.maxMembers}
                              onChange={(e) => handleInputChange("maxMembers", Number.parseInt(e.target.value))}
                          />
                          <span className="badge badge-primary">{formData.maxMembers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Privacy */}
                  <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Privacy Settings</h3>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                        <span className="label-text font-medium">
                          <div className="flex items-center gap-2">
                            {formData.isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                            Private Group
                          </div>
                        </span>
                          <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              checked={formData.isPrivate}
                              onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
                          />
                        </label>
                        <label className="label">
                        <span className="label-text-alt">
                          {formData.isPrivate ? "Only invited members can join" : "Anyone can discover and join"}
                        </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                      <div className="flex items-center gap-2 mb-4">
                        <Hash className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Tags</h3>
                        <div className="badge badge-ghost">{formData.tags.length}/10</div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Add a tag..."
                            className="input input-bordered input-sm flex-1 focus:input-primary"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            maxLength={20}
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="btn btn-primary btn-sm"
                            disabled={!newTag.trim() || formData.tags.length >= 10}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="badge badge-primary gap-2 hover:badge-primary-focus transition-colors"
                                >
                            #{tag}
                                  <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      className="hover:text-error transition-colors"
                                  >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                            ))}
                          </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                      <Flag className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Group Rules</h3>
                      <div className="badge badge-ghost">{formData.rules.length}/10</div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <input
                          type="text"
                          placeholder="Add a rule..."
                          className="input input-bordered flex-1 focus:input-primary"
                          value={newRule}
                          onChange={(e) => setNewRule(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
                          maxLength={200}
                      />
                      <button
                          type="button"
                          onClick={addRule}
                          className="btn btn-primary"
                          disabled={!newRule.trim() || formData.rules.length >= 10}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {formData.rules.length > 0 && (
                        <div className="space-y-2">
                          {formData.rules.map((rule, index) => (
                              <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                              >
                                <span className="badge badge-primary badge-sm mt-0.5">{index + 1}</span>
                                <span className="flex-1">{rule}</span>
                                <button
                                    type="button"
                                    onClick={() => removeRule(rule)}
                                    className="btn btn-ghost btn-sm hover:btn-error"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  {onCancel && (
                      <button type="button" onClick={onCancel} className="btn btn-outline flex-1">
                        Cancel
                      </button>
                  )}
                  <button type="submit" className="btn btn-primary flex-1 gap-2" disabled={isLoading}>
                    {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Updating...
                        </>
                    ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Group
                        </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar for Update Mode */}
            <div className="space-y-6">
              {/* Preview Card */}
              {showPreview && (
                  <div className="card bg-base-100 shadow-xl border border-base-300 sticky top-8">
                    <div className="card-body">
                      <div className="flex items-center gap-2 mb-4">
                        <Eye className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Preview</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-lg">{formData.name || "Group Name"}</h4>
                          <p className="text-sm text-base-content/70 line-clamp-3">
                            {formData.description || "Group description will appear here..."}
                          </p>
                        </div>

                        {(formData.nativeLanguage || formData.learningLanguage) && (
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="w-4 h-4" />
                              <span>
                          {formData.nativeLanguage || "?"} → {formData.learningLanguage || "?"}
                        </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          <span>Max {formData.maxMembers} members</span>
                          {formData.isPrivate && <Lock className="w-3 h-3" />}
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {formData.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="badge badge-primary badge-xs">
                            #{tag}
                          </span>
                              ))}
                              {formData.tags.length > 3 && (
                                  <span className="badge badge-ghost badge-xs">+{formData.tags.length - 3}</span>
                              )}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              )}

              {/* Update Tips */}
              <div className="card bg-gradient-to-br from-info/10 to-success/10 border border-info/20">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-info" />
                    <h3 className="font-semibold">Update Tips</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Changes will be visible to all group members</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Members will be notified of important changes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Consider announcing major changes in the group chat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }

  // Create mode - stepped form
  return (
      <div className="space-y-8">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {getStepTitle()}
            </h2>
            <p className="text-base-content/70 text-sm">
              Step {currentStep} of 3
              {templateApplied && (
                  <span className="ml-2 badge badge-success badge-sm">
                <Zap className="w-3 h-3 mr-1" />
                Template Applied
              </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-base-content/70">Progress:</span>
              <div className="w-32 bg-base-300 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
            </div>

            {/* Preview Toggle */}
            <button onClick={() => setShowPreview(!showPreview)} className="btn btn-outline btn-sm gap-2">
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center">
          <div className="steps steps-horizontal">
            <div className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>Basic Info</div>
            <div className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>Languages</div>
            <div className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
              {templateApplied && !editingTemplate ? "Finalize" : "Customize"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} onKeyDown={e => {
              if (e.key === "Enter" && currentStep < 3) {
                e.preventDefault();
              }
            }}
                  className="space-y-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                  <>
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      {/* Template Applied Banner */}
                      {templateApplied && (
                          <div className="alert alert-success shadow-lg">
                            <div className="flex items-center gap-2">
                              <Zap className="w-5 h-5" />
                              <div>
                                <h3 className="font-bold">Template Applied: {appliedTemplateName}</h3>
                                <div className="text-xs">
                                  Tags and rules have been pre-filled. You can customize them later.
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                  type="button"
                                  onClick={() => setEditingTemplate(true)}
                                  className="btn btn-ghost btn-sm gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit
                              </button>
                              <button type="button" onClick={clearTemplate} className="btn btn-ghost btn-sm">
                                Clear
                              </button>
                            </div>
                          </div>
                      )}

                      {/* Templates */}
                      {!templateApplied && (
                          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                            <div className="card-body">
                              <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Quick Start Templates</h3>
                                <div className="badge badge-primary badge-sm">Recommended</div>
                              </div>
                              <p className="text-sm text-base-content/70 mb-4">
                                Choose a template to get started quickly with pre-filled content
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {groupTemplates.map((template, index) => (
                                    <div
                                        key={index}
                                        className="card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105"
                                        onClick={() => applyTemplate(template)}
                                    >
                                      <div className="card-body p-4">
                                        <h4 className="font-medium text-sm flex items-center gap-2">
                                          <Sparkles className="w-4 h-4 text-primary" />
                                          {template.name}
                                        </h4>
                                        <p className="text-xs text-base-content/70 line-clamp-2">{template.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {template.tags.slice(0, 2).map((tag) => (
                                              <span key={tag} className="badge badge-primary badge-xs">
                                    #{tag}
                                  </span>
                                          ))}
                                          <span className="badge badge-ghost badge-xs">+{template.rules.length} rules</span>
                                        </div>
                                      </div>
                                    </div>
                                ))}
                              </div>
                            </div>
                          </div>
                      )}

                      {/* Basic Info Form */}
                      <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body">
                          <div className="flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="card-title text-xl">Basic Information</h2>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <label className="label">
                          <span className="label-text font-medium flex items-center gap-2">
                            Group Name *{validationErrors.name && <AlertCircle className="w-4 h-4 text-error" />}
                          </span>
                              </label>
                              <input
                                  type="text"
                                  placeholder="e.g., Spanish Conversation Club"
                                  className={`input input-bordered w-full transition-all ${
                                      validationErrors.name ? "input-error" : "focus:input-primary"
                                  }`}
                                  value={formData.name}
                                  onChange={(e) => handleInputChange("name", e.target.value)}
                                  maxLength={100}
                              />
                              <label className="label">
                          <span className={`label-text-alt ${validationErrors.name ? "text-error" : ""}`}>
                            {validationErrors.name || `${formData.name.length}/100`}
                          </span>
                              </label>
                            </div>

                            <div>
                              <label className="label">
                          <span className="label-text font-medium flex items-center gap-2">
                            Description *
                            {validationErrors.description && <AlertCircle className="w-4 h-4 text-error" />}
                          </span>
                              </label>
                              <textarea
                                  placeholder="Describe your group's purpose, goals, and what members can expect..."
                                  className={`textarea textarea-bordered w-full h-32 transition-all ${
                                      validationErrors.description ? "textarea-error" : "focus:textarea-primary"
                                  }`}
                                  value={formData.description}
                                  onChange={(e) => handleInputChange("description", e.target.value)}
                                  maxLength={500}
                              />
                              <label className="label">
                          <span className={`label-text-alt ${validationErrors.description ? "text-error" : ""}`}>
                            {validationErrors.description || `${formData.description.length}/500`}
                          </span>
                              </label>
                            </div>

                            <div>
                              <label className="label">
                                <span className="label-text font-medium">Category</span>
                              </label>
                              <select
                                  className="select select-bordered w-full focus:select-primary"
                                  value={formData.category}
                                  onChange={(e) => handleInputChange("category", e.target.value)}
                              >
                                <option value="general">General Learning</option>
                                <option value="conversation">Conversation Practice</option>
                                <option value="grammar">Grammar Focus</option>
                                <option value="business">Business Language</option>
                                <option value="academic">Academic Preparation</option>
                                <option value="cultural">Cultural Exchange</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Images Upload Section */}
                    <ImageUploadField
                      label="Cover Image"
                      description="This image will be displayed at the top of your group page"
                      value={formData.coverImage}
                      onChange={(img) => handleInputChange("coverImage", img)}
                      recommended="1200x800px, PNG/JPG/WebP, up to 5MB"
                      width={1200}
                      height={800}
                      quality={0.7}
                    />

                    <ImageUploadField
                      label="Group Profile Picture"
                      description="This will be displayed as your group's avatar"
                      value={formData.image}
                      onChange={(img) => handleInputChange("image", img)}
                      recommended="400x400px, PNG/JPG/WebP, up to 5MB"
                      width={400}
                      height={400}
                      quality={0.8}
                      rounded
                    />
                  </>


                )}

              {/* Step 2: Languages */}
              {currentStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div className="card bg-base-100 shadow-xl border border-base-300">
                      <div className="card-body">
                        <div className="flex items-center gap-2 mb-6">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <h2 className="card-title text-xl">Language Settings</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="label">
                          <span className="label-text font-medium flex items-center gap-2">
                            Native Language *
                            {validationErrors.nativeLanguage && <AlertCircle className="w-4 h-4 text-error" />}
                          </span>
                            </label>
                            <select
                                className={`select select-bordered w-full transition-all ${
                                    validationErrors.nativeLanguage ? "select-error" : "focus:select-primary"
                                }`}
                                value={formData.nativeLanguage}
                                onChange={(e) => handleInputChange("nativeLanguage", e.target.value)}
                            >
                              <option value="">Select native language</option>
                              {LANGUAGES.map((lang) => (
                                  <option key={lang} value={lang}>
                                    {lang}
                                  </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="label">
                          <span className="label-text font-medium flex items-center gap-2">
                            Learning Language *
                            {validationErrors.learningLanguage && <AlertCircle className="w-4 h-4 text-error" />}
                          </span>
                            </label>
                            <select
                                className={`select select-bordered w-full transition-all ${
                                    validationErrors.learningLanguage ? "select-error" : "focus:select-primary"
                                }`}
                                value={formData.learningLanguage}
                                onChange={(e) => handleInputChange("learningLanguage", e.target.value)}
                            >
                              <option value="">Select learning language</option>
                              {LANGUAGES.map((lang) => (
                                  <option key={lang} value={lang}>
                                    {lang}
                                  </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Target Level</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary"
                                value={formData.level}
                                onChange={(e) => handleInputChange("level", e.target.value)}
                            >
                              <option value="all">All Levels Welcome</option>
                              <option value="beginner">Beginner (A1-A2)</option>
                              <option value="intermediate">Intermediate (B1-B2)</option>
                              <option value="advanced">Advanced (C1-C2)</option>
                            </select>
                          </div>

                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Meeting Schedule</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary"
                                value={formData.meetingSchedule}
                                onChange={(e) => handleInputChange("meetingSchedule", e.target.value)}
                            >
                              <option value="flexible">Flexible Schedule</option>
                              <option value="daily">Daily Sessions</option>
                              <option value="weekly">Weekly Meetings</option>
                              <option value="biweekly">Bi-weekly Meetings</option>
                              <option value="monthly">Monthly Gatherings</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Step 3: Settings & Customization */}
              {currentStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    {/* Group Settings */}
                    <div className="card bg-base-100 shadow-xl border border-base-300">
                      <div className="card-body">
                        <div className="flex items-center gap-2 mb-6">
                          <Shield className="w-5 h-5 text-primary" />
                          <h2 className="card-title text-xl">Group Settings</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Maximum Members</span>
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                  type="range"
                                  min="5"
                                  max="100"
                                  className="range range-primary flex-1"
                                  value={formData.maxMembers}
                                  onChange={(e) => handleInputChange("maxMembers", Number.parseInt(e.target.value))}
                              />
                              <span className="badge badge-primary">{formData.maxMembers}</span>
                            </div>
                          </div>

                          <div className="form-control">
                            <label className="label cursor-pointer">
                          <span className="label-text font-medium">
                            <div className="flex items-center gap-2">
                              {formData.isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                              Private Group
                            </div>
                          </span>
                              <input
                                  type="checkbox"
                                  className="toggle toggle-primary"
                                  checked={formData.isPrivate}
                                  onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
                              />
                            </label>
                            <label className="label">
                          <span className="label-text-alt">
                            {formData.isPrivate ? "Only invited members can join" : "Anyone can discover and join"}
                          </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Template Content Preview/Edit */}
                    {templateApplied && !editingTemplate && (
                        <div className="card bg-gradient-to-r from-success/10 to-primary/10 border border-success/20">
                          <div className="card-body">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-success" />
                                <h3 className="font-semibold">Template Content Applied</h3>
                              </div>
                              <button
                                  type="button"
                                  onClick={() => setEditingTemplate(true)}
                                  className="btn btn-outline btn-sm gap-2"
                              >
                                <Edit3 className="w-4 h-4" />
                                Customize
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Hash className="w-4 h-4" />
                                  Tags ({formData.tags.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {formData.tags.map((tag) => (
                                      <span key={tag} className="badge badge-success">
                                #{tag}
                              </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Flag className="w-4 h-4" />
                                  Rules ({formData.rules.length})
                                </h4>
                                <div className="space-y-1">
                                  {formData.rules.map((rule, index) => (
                                      <div key={index} className="text-sm flex items-start gap-2">
                                        <span className="badge badge-success badge-sm mt-0.5">{index + 1}</span>
                                        <span className="flex-1">{rule}</span>
                                      </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* Custom Tags & Rules (only if no template or editing) */}
                    {(!templateApplied || editingTemplate) && (
                        <>
                          {/* Tags */}
                          <div className="card bg-base-100 shadow-xl border border-base-300">
                            <div className="card-body">
                              <div className="flex items-center gap-2 mb-4">
                                <Hash className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Tags</h3>
                                <div className="badge badge-ghost">{formData.tags.length}/10</div>
                              </div>
                              <p className="text-base-content/70 mb-4">Help others discover your group</p>

                              <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Add a tag..."
                                    className="input input-bordered flex-1 focus:input-primary"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                    maxLength={20}
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="btn btn-primary"
                                    disabled={!newTag.trim() || formData.tags.length >= 10}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {formData.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-primary gap-2 hover:badge-primary-focus transition-colors"
                                        >
                                #{tag}
                                          <button
                                              type="button"
                                              onClick={() => removeTag(tag)}
                                              className="hover:text-error transition-colors"
                                          >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                                    ))}
                                  </div>
                              )}
                            </div>
                          </div>

                          {/* Rules */}
                          <div className="card bg-base-100 shadow-xl border border-base-300">
                            <div className="card-body">
                              <div className="flex items-center gap-2 mb-4">
                                <Flag className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Group Rules</h3>
                                <div className="badge badge-ghost">{formData.rules.length}/10</div>
                              </div>
                              <p className="text-base-content/70 mb-4">Set guidelines for a positive learning environment</p>

                              <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Add a rule..."
                                    className="input input-bordered flex-1 focus:input-primary"
                                    value={newRule}
                                    onChange={(e) => setNewRule(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
                                    maxLength={200}
                                />
                                <button
                                    type="button"
                                    onClick={addRule}
                                    className="btn btn-primary"
                                    disabled={!newRule.trim() || formData.rules.length >= 10}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {formData.rules.length > 0 && (
                                  <div className="space-y-2">
                                    {formData.rules.map((rule, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                                        >
                                          <span className="badge badge-primary badge-sm mt-0.5">{index + 1}</span>
                                          <span className="flex-1">{rule}</span>
                                          <button
                                              type="button"
                                              onClick={() => removeRule(rule)}
                                              className="btn btn-ghost btn-sm hover:btn-error"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                    ))}
                                  </div>
                              )}
                            </div>
                          </div>
                        </>
                    )}

                    {/* Save Template Edits */}
                    {editingTemplate && (
                        <div className="flex justify-end">
                          <button type="button" onClick={() => setEditingTemplate(false)} className="btn btn-success gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Save Changes
                          </button>
                        </div>
                    )}
                  </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4">
                {currentStep > 1 && (
                    <button type="button" onClick={prevStep} className="btn btn-outline flex-1">
                      Previous
                    </button>
                )}

                {currentStep < 3 ? (
                    <button type="button" onClick={nextStep} className="btn btn-primary flex-1">
                      {templateApplied && currentStep === 2 ? "Finalize Group" : "Next Step"}
                    </button>
                ) : (
                    <button type="submit" className="btn btn-primary flex-1 gap-2" disabled={isLoading}>
                      {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Creating Group...
                          </>
                      ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Create Group
                          </>
                      )}
                    </button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            {showPreview && (
                <div className="card bg-base-100 shadow-xl border border-base-300 sticky top-8">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Preview</h3>
                      {templateApplied && (
                          <div className="badge badge-success badge-sm">
                            <Zap className="w-3 h-3 mr-1" />
                            Template
                          </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-lg">{formData.name || "Group Name"}</h4>
                        <p className="text-sm text-base-content/70 line-clamp-3">
                          {formData.description || "Group description will appear here..."}
                        </p>
                      </div>

                      {(formData.nativeLanguage || formData.learningLanguage) && (
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="w-4 h-4" />
                            <span>
                        {formData.nativeLanguage || "?"} → {formData.learningLanguage || "?"}
                      </span>
                          </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        <span>Max {formData.maxMembers} members</span>
                        {formData.isPrivate && <Lock className="w-3 h-3" />}
                      </div>

                      {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {formData.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="badge badge-primary badge-xs">
                          #{tag}
                        </span>
                            ))}
                            {formData.tags.length > 3 && (
                                <span className="badge badge-ghost badge-xs">+{formData.tags.length - 3}</span>
                            )}
                          </div>
                      )}

                      {formData.rules.length > 0 && (
                          <div className="text-xs text-base-content/70">
                            <Flag className="w-3 h-3 inline mr-1" />
                            {formData.rules.length} group rule{formData.rules.length > 1 ? "s" : ""} set
                          </div>
                      )}
                    </div>
                  </div>
                </div>
            )}

            {/* Template Benefits */}
            {templateApplied && (
                <div className="card bg-gradient-to-br from-success/10 to-primary/10 border border-success/20">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-success" />
                      <h3 className="font-semibold">Template Benefits</h3>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Pre-configured with proven content</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Faster setup process</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Optimized for engagement</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Can be customized anytime</span>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* Tips Card */}
            <div className="card bg-gradient-to-br from-info/10 to-success/10 border border-info/20">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-info" />
                  <h3 className="font-semibold">Tips for Success</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Use templates for faster setup</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Add relevant tags to help learners find your group</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Set clear rules for a positive environment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Start with smaller groups for better engagement</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unsaved Changes Warning */}
            {hasUnsavedChanges && (
                <div className="alert alert-warning shadow-lg">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold">Unsaved Changes</h3>
                    <div className="text-xs">Your progress will be lost if you leave this page.</div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default GroupForm
