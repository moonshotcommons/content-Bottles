import { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import clsx from "clsx";
import siteConfig from "@/config";
import { useLocation, Link as RouterLink } from "react-router-dom";

import  useInteracton from "@/hooks/use-interacton";
export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const {allBottles} = useInteracton();

  return (
    <NextUINavbar
      className="bg-black h-24 min-h-24 flex items-center text-[#716C6C] shadow-md"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full justify-start items-center h-full">
        <NavbarBrand className="gap-3 max-w-fit">
          <RouterLink
            className="flex justify-start items-center gap-1 text-foreground"
            to="/"
          >
            <div className="h-16 w-16 flex items-center justify-center">
              <img
                alt="logo"
                className="max-h-full max-w-full object-contain"
                src="/logo.png"
              />
            </div>
          </RouterLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              key={item.href}
              className={clsx(
                "relative",
                location.pathname === item.href &&
                  "after:content-[''] after:absolute after:bottom-0 after:left-0 mx-4 after:w-full after:h-[3px] after:bg-[#FB0C0C]"
              )}
              isActive={location.pathname === item.href}
            >
              <RouterLink
                className={clsx(
                  "data-[active=true]:text-white data-[active=true]:font-medium",
                  "hover:text-white",
                  "text-4xl"
                )}
                data-active={location.pathname === item.href}
                to={item.href}
              >
                {item.label}
              </RouterLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full justify-end items-center h-full"
        justify="end"
      >
        <div className="flex mr-8">
          <div className="text-xl w-full text-center">
            <div className="label">Total Bottles: </div>
            <span className="font-bold text-green-500">{allBottles?.length||0}</span>
          </div>
        </div>
          <w3m-button/>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle className="navbar-menu-toggle" />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <RouterLink
                className={clsx(
                  "text-[#716C6C] hover:text-white",
                  "text-4xl",
                  location.pathname === item.href
                    ? "text-white font-medium"
                    : "",
                )}
                to={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </RouterLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
