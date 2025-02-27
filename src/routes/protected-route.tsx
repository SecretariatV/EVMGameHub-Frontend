"use client";

import { adminWallets } from "@/constants/data";
import { useAppSelector } from "@/store/redux";
import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userData = useAppSelector((store: any) => store.user.userData);
  const { address: accountAddress } = useAccount();

  // if (
  //   userData?.role !== "ADMIN" &&
  //   !adminWallets.includes(accountAddress || "")
  // ) {
  //   return <Navigate to={"/"} replace />;
  // }
  return children;
};

export default ProtectedRoute;
