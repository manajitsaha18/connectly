import { useEffect, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile } from "../lib/api";
import { LoaderIcon, MapPin, ShuffleIcon, Camera } from "lucide-react";
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { authUser } = useAuthUser();

    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
        fullName: "",
        bio: "",
        nativeLanguage: "",
        learningLanguage: "",
        location: "",
        profilePic: "",
    });

    useEffect(() => {
        if (authUser) {
            setFormState({
                fullName: authUser.fullName || "",
                bio: authUser.bio || "",
                nativeLanguage: authUser.nativeLanguage || "",
                learningLanguage: authUser.learningLanguage || "",
                location: authUser.location || "",
                profilePic: authUser.profilePic || "",
            });
        }
    }, [authUser]);

    const { mutate: updateProfileMutation, isPending } = useMutation({
        mutationFn: updateProfile,

        onSuccess: () => {
            toast.success("Profile updated successfully");

            queryClient.invalidateQueries({
                queryKey: ["authUser"],
            });
            navigate("/");
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        updateProfileMutation(formState);
    };

    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1;

        const randomAvatar = `https://api.dicebear.com/10.x/adventurer/svg?seed=${idx}`;

        setFormState({
            ...formState,
            profilePic: randomAvatar,
        });
    };

    return (
        <div
            className="h-screen bg-base-100 flex items-center justify-center p-4 overflow-hidden"
            data-theme="forest"
        >
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body px-6 py-4 sm:px-8 sm:py-5">

                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3">
                        Edit Your Profile
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* PROFILE PIC CONTAINER */}
                        <div className="flex flex-col items-center justify-center space-y-4">

                            {/* IMAGE PREVIEW */}
                            <div className="size-24 rounded-full bg-base-300 overflow-hidden">
                                {formState.profilePic ? (
                                    <img
                                        src={formState.profilePic}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Camera className="size-10 text-base-content opacity-40" />
                                    </div>
                                )}
                            </div>

                            {/* RANDOM AVATAR BUTTON */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleRandomAvatar}
                                    className="btn btn-accent btn-sm"
                                >
                                    <ShuffleIcon className="size-4 mr-2" />
                                    Generate Random Avatar
                                </button>
                            </div>

                        </div>

                        {/* FULL NAME */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={formState.fullName}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        fullName: e.target.value,
                                    })
                                }
                                className="input input-bordered w-full focus:outline-none focus:ring-0"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* BIO */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>

                            <textarea
                                name="bio"
                                value={formState.bio}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        bio: e.target.value,
                                    })
                                }
                                className="textarea textarea-bordered h-16 w-full focus:outline-none focus:ring-0"
                                placeholder="Tell others about yourself and your language learning goals"
                            />
                        </div>

                        {/* LANGUAGES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* NATIVE LANGUAGE */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Native Language</span>
                                </label>

                                <select
                                    name="nativeLanguage"
                                    value={formState.nativeLanguage}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            nativeLanguage: e.target.value,
                                        })
                                    }
                                    className="select select-bordered w-full focus:outline-none focus:ring-0"
                                >
                                    <option value="">
                                        Select your native language
                                    </option>

                                    {LANGUAGES.map((lang) => (
                                        <option
                                            key={`native-${lang}`}
                                            value={lang.toLowerCase()}
                                        >
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* LEARNING LANGUAGE */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Learning Language</span>
                                </label>

                                <select
                                    name="learningLanguage"
                                    value={formState.learningLanguage}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            learningLanguage: e.target.value,
                                        })
                                    }
                                    className="select select-bordered w-full focus:outline-none focus:ring-0"
                                >
                                    <option value="">
                                        Select language you're learning
                                    </option>

                                    {LANGUAGES.map((lang) => (
                                        <option
                                            key={`learning-${lang}`}
                                            value={lang.toLowerCase()}
                                        >
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        {/* LOCATION */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>

                            <div className="relative">

                                <input
                                    type="text"
                                    name="location"
                                    value={formState.location}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            location: e.target.value,
                                        })
                                    }
                                    className="input input-bordered w-full pl-10 focus:outline-none focus:ring-0"
                                    placeholder="City, Country"
                                />

                                <MapPin className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />

                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            className="btn btn-primary w-full"
                            disabled={isPending}
                            type="submit"
                        >
                            {!isPending ? (
                                <>Save Changes</>
                            ) : (
                                <>
                                    <LoaderIcon className="animate-spin size-5 mr-2" />
                                    Saving...
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;