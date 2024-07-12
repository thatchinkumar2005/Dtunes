import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGetAuthUser from "../../features/Users/hooks/useGetAuthUser";
import DropDown from "./DropDown";
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineProfile } from "react-icons/ai";
import { MdManageAccounts } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

function ProfileButton({ onClick }) {
  const { data: user } = useGetAuthUser();
  return (
    <>
      {user?.files?.profilePic ? (
        <img
          className="h-16 rounded-full "
          src={user?.files?.profilePic}
          onClick={onClick}
        />
      ) : (
        <FaRegUserCircle
          onClick={onClick}
          className="h-10 w-10 ml-auto mr-3 "
        />
      )}
    </>
  );
}

export default function NavBar() {
  const { data, isPending, isSuccess } = useGetAuthUser();
  const [openDropDown, setOpenDropDown] = useState(false);
  return (
    <div className="flex bg-layout flex-row items-center md:gap-3 md:col-start-1 md:col-end-3 border-b-2 border-primary">
      <h1 className="text-2xl md:text-2xl mx-3">Dtunes</h1>
      <Link className="hidden md:block md:mx-10 hover:scale-125  md:hover:scale-150 duration-100 ">
        Home
      </Link>
      <Link className="hidden md:block md:mx-10 hover:scale-125  md:hover:scale-150 duration-100 ">
        Search
      </Link>
      <Link className="hidden md:block md:mx-10 hover:scale-125  md:hover:scale-150 duration-100 ">
        Social
      </Link>
      <Link className="hidden md:block md:mx-10 hover:scale-125 md:hover:scale-150 duration-100 ">
        Library
      </Link>

      <div className="mt-1 ml-auto mr-3">
        <DropDown
          ToggleButton={ProfileButton}
          isOpen={openDropDown}
          setOpen={setOpenDropDown}
        >
          <div className="flex flex-col gap-1 px-3 py-1">
            <div className="flex gap-1 items-center">
              <AiOutlineProfile />
              <Link
                onClick={() => {
                  setOpenDropDown(false);
                }}
                to={"/profile"}
                className="hover:underline"
              >
                Profile
              </Link>
            </div>
            <div className="flex gap-1 items-center">
              <MdManageAccounts />
              <Link
                onClick={() => {
                  setOpenDropDown(false);
                }}
                className="hover:underline"
              >
                Account
              </Link>
            </div>
            <div className="flex gap-1 items-center">
              <CiLogout />
              <Link
                onClick={() => {
                  setOpenDropDown(false);
                }}
                to="/auth/logout"
                className="hover:underline"
              >
                Logout
              </Link>
            </div>
          </div>
        </DropDown>
      </div>
    </div>
  );
}
