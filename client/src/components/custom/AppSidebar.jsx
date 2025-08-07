import {
  ChartBar,
  FilePlus2Icon,
  GalleryVerticalEnd,
  PackageSearch,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/redux/store/authSlice";

// Menu items.
const items = [
  {
    title: "Create Products",
    url: "/admin/dashboard",
    icon: FilePlus2Icon,
  },
  {
    title: "All Products",
    url: "/admin/dashboard/all-products",
    icon: GalleryVerticalEnd,
  },
  {
    title: "Orders",
    url: "/admin/dashboard/orders",
    icon: PackageSearch,
  },
  {
    title: "Analytics",
    url: "/admin/dashboard/analytics",
    icon: ChartBar,
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  return (
    <Sidebar className="w-full md:w-64 flex-shrink-0">
      <SidebarHeader className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
          Dashboard
        </h3>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`flex items-center gap-2 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                    pathname === item.url ? "bg-zinc-200 dark:bg-zinc-600" : ""
                  }`}
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        <Button
          className="w-full text-sm font-medium"
          onClick={() => dispatch(setUserLogout())}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
