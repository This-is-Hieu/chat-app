import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen flex justify-center p-6 pt-20">
      <div className="w-full max-w-md space-y-8 bg-base-300 rounded-xl p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-base-content/60">Your profile information</p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
  
              className="size-32 rounded-full border-4 object-cover"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-base-content p-2 rounded-full cursor-pointer transition-all ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* User Info */}
        <div className="space-y-4 text-sm">
          <div>
            <div className="flex items-center gap-2 text-zinc-400"><User className="w-4 h-4" /> Full Name</div>
            <p className="px-4 py-2 rounded-lg border bg-base-200">{authUser?.fullName}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-zinc-400"><Mail className="w-4 h-4" /> Email</div>
            <p className="px-4 py-2 rounded-lg border bg-base-200">{authUser?.email}</p>
          </div>
          <div className="flex justify-between py-2 border-t border-zinc-700">
            <span>Member Since</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
