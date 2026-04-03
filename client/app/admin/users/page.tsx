"use client";
import React from "react";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AdminSideBar from "../../components/Admin/sideBar/AdminSideBar";
import AllUsers from "../../components/Admin/Users/AllUsers";

export default function Page() {
  return (
    <AdminProtected>
      <Heading
        title="Admin - Tech Learning"
        description="Tech Learning is a platform for online learning and education."
        keywords="Tech Learning, online learning, education, courses, tutorials, training"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSideBar />
        </div>
        <div className="w-4/5 p-4">
          <DashboardHero />
          <AllUsers />
        </div>
      </div>
    </AdminProtected>
  );
}
