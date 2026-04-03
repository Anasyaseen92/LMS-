"use client";
import React, { FC,useState } from "react";
import { useRouter } from "next/navigation";
// Sidebar UI components
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import {
  HomeOutlined,
  ArrowForwardIos,
  ArrowBackIos,
  PeopleOutlined,
  ReceiptOutlined,
  BarChartOutlined,
  MapOutlined,
  Groups,
  OndemandVideo,
  VideoCall,
  Web,
  Quiz,
  Wysiwyg,
  ManageHistory,
  ExitToApp,
} from "@mui/icons-material";
import avatarDefault from "../../../../public/asseste/avatardefault.jpg";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useLogoutQuery } from "../../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { RootState } from "../../../../redux/store";

interface itemProps {
  title: string;
  to: string;
  icon: React.ReactElement;
  selected: string;
  setSelected: (selected: string) => void;
}
// A reusable sidebar link component
const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
  const router = useRouter();
  
  const handleClick = () => {
    setSelected(title);
    router.push(to);
  };
  
  return (
    <MenuItem
      active={selected === title}
      onClick={handleClick}
      icon={icon}
      component="div"
      className="w-full cursor-pointer"
    >
      <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const router = useRouter();
  const [logout, setLogout] = useState(false);

  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logoutHandler = async () => {
    setLogout(true);
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: "#111C43 !important",
        },
        "& .ps-sidebar-container": {
          background: "#111C43 !important",
          backdropFilter: "none !important",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: "#ffffffc1",
        },
      }}
      className="h-full !bg-[#111C43]"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 99999999999999,
          width: isCollapsed ? "80px" : "260px",
          backgroundColor: "#111C43",
        }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIos /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="10px"
              >
                <h3 
                  className="text-[25px] font-Poppins uppercase text-white cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  ELearning
                </h3>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <ArrowBackIos className="text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  src={user?.avatar?.url || avatarDefault}
                  className="w-[80px] h-[80px] rounded-full cursor-pointer"
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "3px solid #5b6fe6",
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  className="!text-[20px] text-[#ffffffc1]"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px] text-[#ffffffc1] capitalize"
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "8%"}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlined />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title="Users"
              to="/admin/users"
              icon={<Groups />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={<ReceiptOutlined />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<VideoCall />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<OndemandVideo />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Customization"}
            </Typography>
            <Item
              title="Hero"
              to="/admin/hero"
              icon={<Web />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<Quiz />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/admin/categories"
              icon={<Wysiwyg />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Controllers"}
            </Typography>
            <Item
              title="Manage Team"
              to="/admin/team"
              icon={<PeopleOutlined />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[18px] text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Analytics"}
            </Typography>
            <Item
              title="Courses Analytics"
              to="/admin/courses-analytics"
              icon={<BarChartOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to="/admin/orders-analytics"
              icon={<MapOutlined />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Users Analytics"
              to="/admin/users-analytics"
              icon={<ManageHistory />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[18px] text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Extras"}
            </Typography>
            <div onClick={logoutHandler}>
              <Item
                title="Logout"
                to="/"
                icon={<ExitToApp />}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
