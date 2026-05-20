import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import React from "react";
import { toast } from "sonner";
import MainLobby from "@/components/lobby/mainLobby.tsx";
const MainLobbyPage = () => {
  return <MainLobby />;
};

export default MainLobbyPage;
