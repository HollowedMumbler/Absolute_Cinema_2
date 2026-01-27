import * as React from "react";

import { useGame } from "@/contexts/GameContext";
import { Spinner } from "./ui/spinner";
import { Navigate } from "react-router";

type ProtectedRoutesProps = { children: React.ReactNode };

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { user, loading } = useGame();

  if (loading)
    return (
      <Spinner className="absolute top-1/2 left-1/2 size-8 -translate-1/2" />
    );

  if (!user) return <Navigate to="/sign-in" replace />;

  if (user.isNew) return <Navigate to="/onboarding" replace />;

  return children;
}
