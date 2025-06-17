import { useState } from 'react';

const ProfilePreferences = ({ preferences, onUpdate }) => {
    const [formData, setFormData] = useState({
        theme: preferences?.theme || 'system',
        notifications: {
            email: preferences?.notifications?.email ?? true,
            push: preferences?.notifications?.push ?? true,
            sound: preferences?.notifications?.sound ?? true
        },
        privacy: {
            showOnlineStatus: preferences?.privacy?.showOnlineStatus ?? true,
            showLastSeen: preferences?.privacy?.showLastSeen ?? true,
            allowFriendRequests: preferences?.privacy?.allowFriendRequests ?? true
        }
    });

    const handleThemeChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            theme: value
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [name]: checked
            }
        }));
    };

    const handlePrivacyChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [name]: checked
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Theme Preferences */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme</h3>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Theme Mode</span>
                        <select
                            value={formData.theme}
                            onChange={handleThemeChange}
                            className="select select-bordered"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </label>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="space-y-2">
                    <label className="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            name="email"
                            checked={formData.notifications.email}
                            onChange={handleNotificationChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Email Notifications</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            name="push"
                            checked={formData.notifications.push}
                            onChange={handleNotificationChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Push Notifications</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            name="sound"
                            checked={formData.notifications.sound}
                            onChange={handleNotificationChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Sound Notifications</span>
                    </label>
                </div>
            </div>

            {/* Privacy Preferences */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacy</h3>
                <div className="space-y-2">
                    <label className="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            name="showOnlineStatus"
                            checked={formData.privacy.showOnlineStatus}
                            onChange={handlePrivacyChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Show Online Status</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            name="showLastSeen"
                            checked={formData.privacy.showLastSeen}
                            onChange={handlePrivacyChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Show Last Seen</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            name="allowFriendRequests"
                            checked={formData.privacy.allowFriendRequests}
                            onChange={handlePrivacyChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Allow Friend Requests</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                    Save Preferences
                </button>
            </div>
        </form>
    );
};

export default ProfilePreferences; 