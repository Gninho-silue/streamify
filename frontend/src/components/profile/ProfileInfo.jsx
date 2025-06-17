import { useState } from 'react';

const ProfileInfo = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: profile.fullName,
        bio: profile.bio,
        nativeLanguage: profile.nativeLanguage,
        learningLanguage: profile.learningLanguage,
        location: profile.location,
        status: profile.status,
        availability: profile.availability,
        interests: profile.interests || []
    });

    const [newInterest, setNewInterest] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    const handleAddInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, newInterest.trim()]
            }));
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(i => i !== interest)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Full Name</span>
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Status</span>
                    </label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="What's on your mind?"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Native Language</span>
                    </label>
                    <input
                        type="text"
                        name="nativeLanguage"
                        value={formData.nativeLanguage}
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Learning Language</span>
                    </label>
                    <input
                        type="text"
                        name="learningLanguage"
                        value={formData.learningLanguage}
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Location</span>
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Availability</span>
                    </label>
                    <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="select select-bordered"
                    >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="away">Away</option>
                    </select>
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Bio</span>
                </label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="Tell us about yourself..."
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Interests</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        className="input input-bordered flex-1"
                        placeholder="Add an interest"
                    />
                    <button
                        type="button"
                        onClick={handleAddInterest}
                        className="btn btn-primary"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.interests.map((interest, index) => (
                        <div
                            key={index}
                            className="badge badge-primary gap-2"
                        >
                            {interest}
                            <button
                                type="button"
                                onClick={() => handleRemoveInterest(interest)}
                                className="btn btn-ghost btn-xs"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default ProfileInfo; 