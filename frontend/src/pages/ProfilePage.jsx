import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, updatePreferences } from '../lib/api';
import toast from 'react-hot-toast';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfilePreferences from '../components/profile/ProfilePreferences';
import ProfileSocial from '../components/profile/ProfileSocial';
import ProfileLoader from '../components/profile/ProfileLoader';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('info');
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success('Profile updated successfully');
        },
        onError: (error) => {
            console.error('Profile update error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Failed to update profile. Please check your data and try again.';
            toast.error(errorMessage);
        }
    });

    const updatePreferencesMutation = useMutation({
        mutationFn: updatePreferences,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success('Preferences updated successfully');
        },
        onError: (error) => {
            console.error('Preferences update error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Failed to update preferences. Please try again.';
            toast.error(errorMessage);
        }
    });

    if (isLoading) return <ProfileLoader />;

    const handleProfileUpdate = (data) => {
        try {
            // Validation basique des données
            if (data.fullName && data.fullName.trim().length < 2) {
                toast.error('Full name must be at least 2 characters long');
                return;
            }

            if (data.bio && data.bio.length > 500) {
                toast.error('Bio must be less than 500 characters');
                return;
            }

            updateProfileMutation.mutate(data);
        } catch (error) {
            console.error('Profile update validation error:', error);
            toast.error('Invalid data provided. Please check your input.');
        }
    };

    const handlePreferencesUpdate = (data) => {
        try {
            updatePreferencesMutation.mutate(data);
        } catch (error) {
            console.error('Preferences update error:', error);
            toast.error('Failed to update preferences. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ProfileHeader 
                profile={profile} 
                onUpdate={handleProfileUpdate}
            />
            
            <div className="mt-12">
                <div className="flex border-b border-base-300">
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'info' 
                                ? 'text-primary border-b-2 border-primary' 
                                : 'text-base-content/70'
                        }`}
                        onClick={() => setActiveTab('info')}
                    >
                        Profile Info
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'social' 
                                ? 'text-primary border-b-2 border-primary' 
                                : 'text-base-content/70'
                        }`}
                        onClick={() => setActiveTab('social')}
                    >
                        Social Links
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'preferences' 
                                ? 'text-primary border-b-2 border-primary' 
                                : 'text-base-content/70'
                        }`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        Preferences
                    </button>
                </div>

                <div className="mt-6">
                    {activeTab === 'info' && (
                        <ProfileInfo 
                            profile={profile} 
                            onUpdate={handleProfileUpdate}
                        />
                    )}
                    {activeTab === 'social' && (
                        <ProfileSocial 
                            profile={profile} 
                            onUpdate={handleProfileUpdate}
                        />
                    )}
                    {activeTab === 'preferences' && (
                        <ProfilePreferences 
                            preferences={profile.preferences} 
                            onUpdate={handlePreferencesUpdate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 