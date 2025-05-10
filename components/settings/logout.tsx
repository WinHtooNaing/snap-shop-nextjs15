"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import SettingCard from "./setting-card";

const LogoutBtn = () => {
  return (
    <SettingCard>
      <h2 className="text-sm font-semibold mb-2 text-red-600">Logout</h2>
      <Button variant={"destructive"} onClick={() => signOut()}>
        <LogOut className="me-2" />
        LogoutBtn
      </Button>
    </SettingCard>
  );
};

export default LogoutBtn;
