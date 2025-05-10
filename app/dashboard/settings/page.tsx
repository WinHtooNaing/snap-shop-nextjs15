import ChangePassword from "@/components/settings/change-password";
import ProfileCard from "@/components/settings/profile-card";
import SettingCard from "@/components/settings/setting-card";
import TwoFactor from "@/components/settings/two-factor";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const Settings = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/");
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <SettingCard title="Settings" description="Manage your account settings">
        <main className="flex flex-col gap-4">
          <ProfileCard session={session} />
          {!session.user.isOauth && (
            <>
              <ChangePassword email={session.user.email} />
              <TwoFactor
                isTwoFactorEnabled={session.user.isTwofactorEnabled}
                email={session.user.email}
              />
            </>
          )}
        </main>
      </SettingCard>
    </>
  );
};

export default Settings;
