"use client"

import { useState, useEffect } from "react"
import { User, Mail, Lock, Shield, Download, Trash2, AlertTriangle, Key, Smartphone, CheckCircle2 } from "lucide-react"
import toast from "react-hot-toast"

const AccountSettings = ({ profile, onFormChange }) => {
    const [settings, setSettings] = useState({
        email: profile?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: profile?.twoFactorEnabled ?? false,
        backupCodes: profile?.backupCodes || [],
    })

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [show2FAModal, setShow2FAModal] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        onFormChange({
            email: settings.email,
            twoFactorEnabled: settings.twoFactorEnabled,
        })
    }, [settings.email, settings.twoFactorEnabled])

    const handleEmailChange = (email) => {
        setSettings((prev) => ({ ...prev, email }))
    }

    const handlePasswordChange = () => {
        if (settings.newPassword !== settings.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (settings.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }
        // Handle password change logic here
        toast.success("Password updated successfully")
        setShowPasswordModal(false)
        setSettings((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
    }

    const handleExportData = async () => {
        setIsExporting(true)
        try {
            // Simulate data export
            await new Promise((resolve) => setTimeout(resolve, 2000))
            const data = {
                profile: profile,
                exportDate: new Date().toISOString(),
                dataTypes: ["profile", "messages", "friends", "settings"],
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `streamify-data-${new Date().toISOString().split("T")[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success("Data exported successfully")
        } catch (error) {
            toast.error("Failed to export data");
        } finally {
            setIsExporting(false)
        }
    }

    const handle2FAToggle = () => {
        if (!settings.twoFactorEnabled) {
            setShow2FAModal(true)
        } else {
            setSettings((prev) => ({ ...prev, twoFactorEnabled: false }))
            toast.success("Two-factor authentication disabled")
        }
    }

    const enable2FA = () => {
        setSettings((prev) => ({
            ...prev,
            twoFactorEnabled: true,
            backupCodes: Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 8).toUpperCase()),
        }))
        setShow2FAModal(false)
        toast.success("Two-factor authentication enabled")
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="avatar placeholder">
                    <div className="bg-warning text-warning-content rounded-2xl w-12">
                        <User className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                    <p className="text-base-content/70">Manage your account security and data</p>
                </div>
            </div>

            {/* Email Settings */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    Email Settings
                </h3>

                <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email Address</span>
                                <span className="label-text-alt text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    className="input input-bordered input-primary flex-1"
                                    value={settings.email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                />
                                <button className="btn btn-outline btn-primary">Update Email</button>
                            </div>
                            <label className="label">
                                <span className="label-text-alt">We'll send a verification email to confirm changes</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Shield className="w-5 h-5 text-secondary" />
                    Security Settings
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-6 h-6 text-secondary" />
                                <h4 className="font-semibold">Password</h4>
                            </div>
                            <p className="text-sm text-base-content/70 mb-4">Keep your account secure with a strong password</p>
                            <button className="btn btn-outline btn-secondary w-full" onClick={() => setShowPasswordModal(true)}>
                                Change Password
                            </button>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-6 h-6 text-accent" />
                                    <h4 className="font-semibold">Two-Factor Authentication</h4>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-accent toggle-lg"
                                    checked={settings.twoFactorEnabled}
                                    onChange={handle2FAToggle}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Add an extra layer of security to your account</p>
                            {settings.twoFactorEnabled && (
                                <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                                    <div className="flex items-center gap-2 text-success font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        2FA Enabled
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Download className="w-5 h-5 text-info" />
                    Data Management
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <Download className="w-6 h-6 text-info" />
                                <h4 className="font-semibold">Export Data</h4>
                            </div>
                            <p className="text-sm text-base-content/70 mb-4">
                                Download a copy of your data including profile, messages, and settings
                            </p>
                            <button
                                className="btn btn-outline btn-info w-full gap-2"
                                onClick={handleExportData}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Export My Data
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="card bg-error/10 border border-error/20 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <Trash2 className="w-6 h-6 text-error" />
                                <h4 className="font-semibold text-error">Delete Account</h4>
                            </div>
                            <p className="text-sm text-base-content/70 mb-4">
                                Permanently delete your account and all associated data
                            </p>
                            <button className="btn btn-error btn-outline w-full gap-2" onClick={() => setShowDeleteModal(true)}>
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-secondary" />
                            Change Password
                        </h3>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Current Password</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered"
                                    value={settings.currentPassword}
                                    onChange={(e) => setSettings((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">New Password</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered"
                                    value={settings.newPassword}
                                    onChange={(e) => setSettings((prev) => ({ ...prev, newPassword: e.target.value }))}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm New Password</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered"
                                    value={settings.confirmPassword}
                                    onChange={(e) => setSettings((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowPasswordModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handlePasswordChange}>
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2FA Setup Modal */}
            {show2FAModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-accent" />
                            Enable Two-Factor Authentication
                        </h3>

                        <div className="space-y-4">
                            <div className="alert alert-info">
                                <Shield className="w-5 h-5" />
                                <div>
                                    <h4 className="font-bold">Enhanced Security</h4>
                                    <div className="text-sm">
                                        Two-factor authentication adds an extra layer of security to your account.
                                    </div>
                                </div>
                            </div>

                            <div className="steps steps-vertical lg:steps-horizontal w-full">
                                <div className="step step-primary">Download App</div>
                                <div className="step step-primary">Scan QR Code</div>
                                <div className="step">Enter Code</div>
                            </div>

                            <div className="text-center">
                                <div className="mockup-phone">
                                    <div className="camera"></div>
                                    <div className="display">
                                        <div className="artboard artboard-demo phone-1 bg-base-200 flex items-center justify-center">
                                            <div className="w-32 h-32 bg-base-300 rounded-lg flex items-center justify-center">
                                                <Key className="w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShow2FAModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-accent" onClick={enable2FA}>
                                Enable 2FA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-3 text-error">
                            <AlertTriangle className="w-5 h-5" />
                            Delete Account
                        </h3>

                        <div className="space-y-4">
                            <div className="alert alert-error">
                                <AlertTriangle className="w-5 h-5" />
                                <div>
                                    <h4 className="font-bold">This action cannot be undone</h4>
                                    <div className="text-sm">All your data will be permanently deleted.</div>
                                </div>
                            </div>

                            <p className="text-base-content/70">
                                Are you sure you want to delete your account? This will permanently remove:
                            </p>

                            <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
                                <li>Your profile and personal information</li>
                                <li>All messages and conversations</li>
                                <li>Friend connections and requests</li>
                                <li>Settings and preferences</li>
                            </ul>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-error">Delete My Account</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountSettings
