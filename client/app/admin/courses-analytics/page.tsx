"use client";
import React from "react";
import Headings from "@/app/utils/Heading";
import CourseAnalytics from "../../components/Admin/Analytics/CourseAnalytics";
import AdminProtected from "@/app/hooks/adminProtected";
import AdminSidebar from "../../components/Admin/sideBar/AdminSideBar";
import DashboardHero from "@/app/components/Admin/DashboardHero";

export default function Page() {
  return (
    <AdminProtected>
      <Headings
        title="ELearning Admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux,AI/ML"
      />
      <div className="flex min-h-screen bg-[#0b1120]">
        <div className="w-[260px] shrink-0">
          <AdminSidebar />
        </div>
        <div className="flex-1 min-w-0 bg-[#0b1120]">
          <DashboardHero isDashboard={true} />
          <CourseAnalytics />
        </div>
      </div>
    </AdminProtected>
  );
}
