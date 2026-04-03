"use client";
import React, { useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Footer from "../components/Footer/Footer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(5);
  const [route, setRoute] = useState("Login");

  const { user } = useSelector((state: RootState) => state.auth);

  const profileUser = user
    ? {
        name: user.name ?? "",
        email: user.email ?? "",
        avatar: {
          url: user.avatar?.url ?? "/asseste/avatardefault.jpg",
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Protected>
        <Heading
          title={`${user?.name} Profile-ELearning`}
          description="ELearning is a platform for online learning and education."
          keywords="ELearning, online learning, education, courses, tutorials, training"
        />

        {/* Header */}
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />

        {/* MAIN CONTENT WITH SPACING */}
        <main className="flex-1 py-10 px-4 md:px-10">
          {profileUser && <Profile user={profileUser} />}
        </main>

        {/* Footer */}
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;