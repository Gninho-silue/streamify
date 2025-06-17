import { useState } from 'react';
import { Github, Linkedin, Twitter, Globe } from 'lucide-react';

const ProfileSocial = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState({
        socialLinks: {
            website: profile.socialLinks?.website || '',
            twitter: profile.socialLinks?.twitter || '',
            linkedin: profile.socialLinks?.linkedin || '',
            github: profile.socialLinks?.github || ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ socialLinks: formData.socialLinks });
    };

    const socialIcons = {
        website: <Globe className="w-5 h-5" />,
        twitter: <Twitter className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />,
        github: <Github className="w-5 h-5" />
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.socialLinks).map(([platform, url]) => (
                    <div key={platform} className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2">
                                {socialIcons[platform]}
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                        </label>
                        <input
                            type="url"
                            name={platform}
                            value={url}
                            onChange={handleChange}
                            className="input input-bordered"
                            placeholder={`Enter your ${platform} URL`}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                    Save Social Links
                </button>
            </div>
        </form>
    );
};

export default ProfileSocial; 