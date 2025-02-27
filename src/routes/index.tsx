import { Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import DashboardLayout from "@/components/layout/dashboard-layout";
import MinesGame from "@/pages/games/mines";
import Home from "@/pages/main/home";
import CrashGame from "@/pages/games/crash";
import CoinFlipGame from "@/pages/games/coin-flip";
import Leaderboard from "@/pages/main/leader-board";
import Dashboard from "@/pages/main/dashboard";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "./protected-route";
import RocketRushGame from "@/pages/games/rocket-rush";
import DesertRunGame from "@/pages/games/desert-run";
import Settings from "@/pages/setting";
import DashboardHistory from "@/pages/main/dashboard/history";
import DashboardProfitLoss from "@/pages/main/dashboard/profit-loss";
import HelpSupport from "@/pages/help-support";

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: "/",
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/leader-board",
          element: <Leaderboard />,
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/history",
          element: (
            <ProtectedRoute>
              <DashboardHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/profit-loss",
          element: (
            <ProtectedRoute>
              <DashboardProfitLoss />
            </ProtectedRoute>
          ),
        },
        {
          path: "/crash",
          element: <CrashGame />,
        },
        {
          path: "/coin-flip",
          element: <CoinFlipGame />,
        },
        {
          path: "/mines",
          element: <MinesGame />,
        },
        {
          path: "/rocket-rush",
          element: <RocketRushGame />,
        },
        {
          path: "/desert-run",
          element: <DesertRunGame />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/help-support",
          element: <HelpSupport />,
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
