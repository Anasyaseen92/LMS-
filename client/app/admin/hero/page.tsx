"use client";
import React from "react";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "../../components/Admin/sideBar/AdminSideBar";
import AdminProtected from "../../hooks/adminProtected";
import DashBoardHero from "../../components/Admin/DashboardHero";
import EditHero from "@/app/components/Admin/Customization/EditHero";

export default function Page() {
  return (
    <AdminProtected>
      <Heading
        title="Elearning - Admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,Redux,Machine Learning"
      />
      <div className="flex min-h-screen bg-[#0b1120]">
        <div className="w-[260px] shrink-0">
          <AdminSidebar />
        </div>
        <div className="flex-1 min-w-0 bg-[#0b1120]">
          <DashBoardHero />
          <EditHero />
        </div>
      </div>
    </AdminProtected>
  );
}
