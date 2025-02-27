export const BACKEND_API_ENDPOINT = {
  auth: {
    base: "/auth",
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    resetPassword: "/auth/reset-password",
  },
  dashboard: {
    base: "/dashboard",
    leaderboard: "/dashboard/leaderboard",
    historyChart: "/dashboard/history-chart",
    history: "/dashboard/history",
  },
  payment: {
    base: "/payment",
    receiveFaucet: "/payment/receive-faucet",
  },
};
