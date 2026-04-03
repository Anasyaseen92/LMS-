import { styles } from "@/app/styles/style";
import {
  useUpdateAvatarMutation,
  useEditProfileMutation,
} from "@/redux/features/user/userApi";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {
  user: {
    name: string;
    avatar: {
      url: string;
    };
    email: string;
  };
  avatar: string | null;
};

const ProfileInfo: FC<Props> = ({ user, avatar }) => {
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
  const imageSrc = avatar || user?.avatar?.url || "/asseste/avatardefault.jpg";

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result as string;
        updateAvatar(avatar);
      }
    };
    if (e.target.files)
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (error && "data" in error) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Something went wrong");
    }
    if (updateError && "data" in updateError) {
      const err = updateError as { data?: { message?: string } };
      toast.error(err.data?.message || "Something went wrong");
    }
    if (isSuccess) {
      toast.success("Avatar updated successfully");
    }
    if (success) {
      toast.success("Profile updated successfully");
    }
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedName = (name || "").trim();
    const normalizedEmail = (email || "").trim();
    if (!normalizedName) return;
    if (!normalizedEmail) return;
    await editProfile({ name: normalizedName, email: normalizedEmail });
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={imageSrc}
            alt=""
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="m-auto block pb-4 w-[100%] 800px:w-[50%]">
            <div className="w-[100%]">
              <label className="block pb-2 dark:text-white text-black">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white text-black">Email Address</label>
              <input
                type="email"
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input
              className={`w-[95%] h-[40px] border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
