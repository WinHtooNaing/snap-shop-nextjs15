import DashboardNavigation from "@/components/navigation/dashboard-nav";
import { auth } from "@/server/auth";
import {
  ChartNoAxesCombined,
  PackagePlus,
  PackageSearch,
  Settings,
  Truck,
} from "lucide-react";
import React from "react";

const publicRoutes = [
  {
    label: "Orders",
    path: "/dashboard/orders",
    icons: <Truck size={16} />,
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icons: <Settings size={16} />,
  },
];
const privateRoutes = [
  {
    label: "Analytics",
    path: "/dashboard/analytics",
    icons: <ChartNoAxesCombined size={16} />,
  },
  {
    label: "Create Product",
    path: "/dashboard/create-product",
    icons: <PackagePlus size={16} />,
  },
  {
    label: "Products",
    path: "/dashboard/products",
    icons: <PackageSearch size={16} />,
  },
];
const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  const routes =
    session?.user.role === "admin"
      ? [...privateRoutes, ...publicRoutes]
      : publicRoutes;
  return (
    <>
      <DashboardNavigation routes={routes} />
      <section>{children}</section>
    </>
  );
};

export default DashboardLayout;
