import Link from 'next/link';
import React, { useState, type FC } from 'react'
import NavItems from "../utils/NavItem";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { ThemeSwitcher } from '../utils/ThemeSwitcher';
import Image from 'next/image';
import CustomModel from '../utils/CustomModal';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Verification from './Auth/Verification';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};


const Header: FC<Props> = ({ activeItem, setOpen, open, route, setRoute }) => {
     const { user } = useSelector((state: RootState) => state.auth);
     const avatar = "/next.svg";
     const [active] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id === "screen") {
      setOpenSideBar(false);
    }
  };
  return (
    <div className="w-full relative ">
        <div className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500 bg-black"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}>
          <div className="w-[95%] min-[800px]:w-[92%] m-auto py-2  h-full">
            <div className="w-full h-[80px] flex items-center justify-between p-3">
                 {/* Logo */}
                  <div>
                    <Link
                href={"/"}
                className="text-[25px] font-Poppins font-[500] text-black dark:text-white "
              >
                Tech-Learning
              </Link>
                    </div>


                   <div className="flex items-center">
                    
                    <NavItems activeItem={activeItem} isMobile={false} />
                      <ThemeSwitcher />

                         {/* only for mobile */}
                         <div className="min-[800px]:hidden ">
                <HiOutlineMenuAlt3
                  className="cursor-pointer dark:text-white text-black  "
                  onClick={() => setOpenSideBar(true)}
                />
              </div>

               {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user?.avatar?.url ?? avatar}
                    alt=""
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer hidden min-[800px]:block"
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "",
                    }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer hidden min-[800px]:block dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
                    </div>
            </div>

          </div>
         {/* Mobile sidebar menu */}
        {openSideBar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white top-0 right-0 dark:bg-slate-900 dark:bg-opacity-90">
              <NavItems activeItem={activeItem} isMobile={true} />

              {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user.avatar?.url ?? avatar}
                    alt=""
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer ml-[20px] "
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "",
                    }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyrigt ©️ 2025 Tech Learning
              </p>
            </div>
          </div>
        )}
          
        </div>
         {route === "Login" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
        />
      )}
      {route === "Sign-Up" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}
      {route === "verification" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  )
}

export default Header;
