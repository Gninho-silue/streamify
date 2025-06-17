import { useState } from 'react';
import { CameraIcon } from 'lucide-react';
import { compressImage, validateImageFile } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const ProfileHeader = ({ profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [coverImage, setCoverImage] = useState(profile.coverPicture);
    const [profileImage, setProfileImage] = useState(profile.profilePicture);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (file, type) => {
        try {
            setIsUploading(true);
            
            // Valider le fichier
            validateImageFile(file);
            
            // Compresser l'image
            const compressedImage = await compressImage(file, type === 'profile' ? 400 : 800, type === 'profile' ? 400 : 600, 0.8);
            
            // Mettre à jour l'état local
            if (type === 'cover') {
                setCoverImage(compressedImage);
                onUpdate({ coverPicture: compressedImage });
            } else {
                setProfileImage(compressedImage);
                onUpdate({ profilePicture: compressedImage });
            }
            
            toast.success(`${type === 'cover' ? 'Cover' : 'Profile'} image updated successfully!`);
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error(error.message || 'Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, 'cover');
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, 'profile');
        }
    };

    return (
        <div className="rounded-lg overflow-hidden bg-base-100 shadow-md">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 rounded-t-lg overflow-hidden bg-base-300">
                {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-base-content/50">No cover image</span>
                    </div>
                )}

                <label className={`absolute bottom-4 right-4 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <CameraIcon className="w-4 h-4" />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleCoverImageChange}
                        disabled={isUploading}
                    />
                </label>
            </div>

            {/* Profile Image + Name + Status */}
            <div className="flex items-center gap-4 px-8 py-4">
                {/* Image de profil */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-base-100 overflow-hidden bg-base-300">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-base-content/50">No image</span>
                            </div>
                        )}

                    </div>
                    <label className={`absolute bottom-2 right-2 btn btn-circle btn-sm bg-base-100 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <CameraIcon className="w-4 h-4" />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleProfileImageChange}
                            disabled={isUploading}
                        />
                    </label>
                </div>

                {/* Nom et statut */}
                <div className="flex-grow">
                    <h1 className="text-2xl font-semibold">{profile.fullName}</h1>
                    <p className="text-gray-500">{profile.status}</p>
                </div>

                {/* Bouton d'édition */}
                <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isUploading}
                >
                    {isEditing ? 'Save' : 'Edit Profile'}
                </button>
            </div>

            {/* Upload Progress Indicator */}
            {isUploading && (
                <div className="absolute top-4 right-4 bg-base-100/90 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="loading loading-spinner loading-sm"></div>
                        <span className="text-sm">Uploading image...</span>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfileHeader; 