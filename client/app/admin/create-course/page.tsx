"use client";
import React from "react";
import AdminSidebar from "../../components/Admin/sideBar/AdminSideBar";
import Heading from "../../utils/Heading";
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import AdminProtected from "../../hooks/adminProtected";

const Page = () => {
  return (
    <AdminProtected>
      <Heading
        title="Create Course - Admin"
        description="Create a new course on ELearning platform."
        keywords="ELearning, create course, online learning, education, courses, tutorials, training"
      />
      <div className="flex min-h-screen bg-[#0b1120]">
        <div className="w-[260px] shrink-0">
          <AdminSidebar />
        </div>
        <div className="flex-1 min-w-0 bg-[#0b1120]">
          <DashboardHeader />
          <CreateCourse />
        </div>
      </div>
    </AdminProtected>
  );
};

export default Page;
