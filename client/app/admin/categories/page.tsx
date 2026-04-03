"use client";
import React from "react";
import AdminDashboardHero from "../../components/Admin/DashboardHero";
import AdminSidebar from "../../components/Admin/sideBar/AdminSideBar";
import AdminProtected from "../../hooks/adminProtected";
import Headings from "@/app/utils/Heading";
import EditCategories from "../../components/Admin/Customization/EditCategories";

export default function Page() {
  return (
    <AdminProtected>
      <Headings
        title="Tech Learning Admin"
        description="Tech Learning is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux,AI/ML"
      />
      <div className="flex min-h-screen bg-[#0b1120]">
        <div className="w-[260px] shrink-0">
          <AdminSidebar />
        </div>
        <div className="flex-1 min-w-0 bg-[#0b1120]">
          <AdminDashboardHero />
          <EditCategories />
        </div>
      </div>
    </AdminProtected>
  );
}
