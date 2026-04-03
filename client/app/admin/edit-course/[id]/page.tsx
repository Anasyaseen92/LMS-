"use client";
import AdminSidebar from "../../../components/Admin/sideBar/AdminSideBar";
import Heading from "../../../../app/utils/Heading";
import EditCourse from "../../../components/Admin/Course/EditCourse";
import DashboardHeader from "../../../components/Admin/DashboardHeader";
import AdminProtected from "../../../hooks/adminProtected";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <AdminProtected>
      <Heading
        title="Edit Course - Admin"
        description="Edit a course on ELearning platform."
        keywords="ELearning, edit course, online learning, education, courses, tutorials, training"
      />
      <div className="flex min-h-screen bg-[#0b1120]">
        <div className="w-[260px] shrink-0">
          <AdminSidebar/>
        </div>
        <div className="flex-1 min-w-0 bg-[#0b1120]">
          <DashboardHeader/>
          <EditCourse id={params.id}/>
        </div>
      </div>
    </AdminProtected>
  );
}
