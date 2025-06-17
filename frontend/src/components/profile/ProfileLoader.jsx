import { LoaderIcon } from 'lucide-react';

const ProfileLoader = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                {/* Cover Image Skeleton */}
                <div className="h-48 md:h-64 rounded-lg bg-base-300" />

                {/* Profile Image Skeleton */}
                <div className="relative -mt-16 ml-8">
                    <div className="w-32 h-32 rounded-full border-4 border-base-100 bg-base-300" />
                </div>

                {/* Profile Info Skeleton */}
                <div className="mt-20 md:mt-24 px-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-base-300 rounded" />
                            <div className="h-4 w-32 bg-base-300 rounded" />
                        </div>
                        <div className="h-10 w-32 bg-base-300 rounded" />
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="mt-8 border-b border-base-300">
                    <div className="flex gap-4">
                        <div className="h-10 w-24 bg-base-300 rounded" />
                        <div className="h-10 w-24 bg-base-300 rounded" />
                        <div className="h-10 w-24 bg-base-300 rounded" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-4 w-24 bg-base-300 rounded" />
                                <div className="h-10 w-full bg-base-300 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLoader; 