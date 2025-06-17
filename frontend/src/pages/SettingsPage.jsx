import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updatePreferences } from '../lib/api';
import toast from 'react-hot-toast';
import { BellIcon, ShieldIcon, PaletteIcon, GlobeIcon, LoaderIcon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../constants';
import ThemeSelector from '../components/ThemeSelector';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const queryClient = useQueryClient();
    const { theme, setTheme } = useThemeStore();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile
    });

    const updatePreferencesMutation = useMutation({
        mutationFn: updatePreferences,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success('Settings updated successfully');
        },
        onError: (error) => {
            console.error('Settings update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <LoaderIcon className="animate-spin size-8 text-primary" />
            </div>
        );
    }

    const handlePreferencesUpdate = (data) => {
        updatePreferencesMutation.mutate(data);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        toast.success(`Theme changed to ${newTheme}`);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <GlobeIcon className="size-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <BellIcon className="size-4" /> },
        { id: 'privacy', label: 'Privacy', icon: <ShieldIcon className="size-4" /> },
        { id: 'appearance', label: 'Appearance', icon: <PaletteIcon className="size-4" /> }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-base-content/70">Manage your account settings and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary text-primary-content'
                                            : 'hover:bg-base-200'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="bg-base-100 rounded-lg border border-base-300 p-6">
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold">General Settings</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium">Language</span>
                                            </label>
                                            <select className="select select-bordered w-full">
                                                <option>English</option>
                                                <option>French</option>
                                                <option>Spanish</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium">Time Zone</span>
                                            </label>
                                            <select className="select select-bordered w-full">
                                                <option>UTC</option>
                                                <option>UTC+1</option>
                                                <option>UTC+2</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                                    <div className="space-y-4">
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                defaultChecked={profile?.preferences?.notifications?.email ?? true}
                                            />
                                            <span className="label-text">Email Notifications</span>
                                        </label>
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                defaultChecked={profile?.preferences?.notifications?.push ?? true}
                                            />
                                            <span className="label-text">Push Notifications</span>
                                        </label>
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                defaultChecked={profile?.preferences?.notifications?.sound ?? true}
                                            />
                                            <span className="label-text">Sound Notifications</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold">Privacy Settings</h2>
                                    <div className="space-y-4">
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                defaultChecked={profile?.preferences?.privacy?.showOnlineStatus ?? true}
                                            />
                                            <span className="label-text">Show Online Status</span>
                                        </label>
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                defaultChecked={profile?.preferences?.privacy?.showLastSeen ?? true}
                                            />
                                            <span className="label-text">Show Last Seen</span>
                                        </label>
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                defaultChecked={profile?.preferences?.privacy?.allowFriendRequests ?? true}
                                            />
                                            <span className="label-text">Allow Friend Requests</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold">Appearance Settings</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium">Theme</span>
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                                <ThemeSelector
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium">Font Size</span>
                                            </label>
                                            <select className="select select-bordered w-full">
                                                <option>Small</option>
                                                <option>Medium</option>
                                                <option>Large</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage; 