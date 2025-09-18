import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { completeOnboarding, uploadProfilePic } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PageLoader from "../components/PageLoader";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useThemeStore from "../store/useThemeStore";

function OnboardingPage() {
  const navigate = useNavigate();
  const { authUser, isLoading } = useAuthUser();
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    profilePic: authUser?.profilePic || "",
  });
  const { theme } = useThemeStore();

  const queryClient = useQueryClient();

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding complete!");
      console.log("Onboarding complete!", authUser);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      window.location.reload();
    },
    onError: () => {
      toast.error("Onboarding failed.");
    },
  });

  const { mutate: uploadMutation, isPending: isUploading } = useMutation({
    mutationFn: uploadProfilePic,
    onSuccess: (data) => {
      if (data?.profilePic) {
        setFormData((prev) => ({ ...prev, profilePic: data.profilePic }));
        toast.success("Profile picture updated");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      } else {
        toast.error(data?.message || "Upload failed");
      }
    },
    onError: () => toast.error("Upload failed"),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formData);
  };

  if (isLoading) {
    return <PageLoader />;
  }
  const isOnboardingComplete = authUser?.isOnboarded;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200" data-theme={theme}>
      <div className="card w-full max-w-lg shadow-2xl bg-base-100 p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          {isOnboardingComplete ? "Update Your Profile" : "Complete Your Onboarding"}
        </h1>
        {/* Profile Preview */}
        {formData.profilePic && (
          <div className="flex justify-center mt-3">
            <img
              src={formData.profilePic}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full border"
            />
          </div>
        )}
        {/* Profile Picture Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Profile Picture</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadMutation(file);
              }
            }}
          />
          {isUploading && <span className="text-sm mt-2">Uploading...</span>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Bio */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Bio</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="textarea textarea-bordered w-full"
              rows="3"
            />
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where are you from?"
              className="input input-bordered w-full"
            />
          </div>

          {/* Native Language */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Native Language</span>
            </label>
            <input
              type="text"
              name="nativeLanguage"
              value={formData.nativeLanguage}
              onChange={handleChange}
              placeholder="Your native language"
              className="input input-bordered w-full"
            />
          </div>

          {/* Learning Language */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Learning Language</span>
            </label>
            <input
              type="text"
              name="learningLanguage"
              value={formData.learningLanguage}
              onChange={handleChange}
              placeholder="Language you're learning"
              className="input input-bordered w-full"
            />
          </div>
          {/* Submit */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary w-full`}
              disabled={isPending}
            >
              {isPending ? "Saving..." : isOnboardingComplete ? "Update Profile" : "Complete Onboarding"}
            </button>
            <div className="form-control mt-6">
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;
