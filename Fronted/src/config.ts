const siteConfig = {
  name: "Bottles",
  description: "Bottles",
  pinata: {
    // Todo
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Bottles",
      href: "/bottles",
    },

    {
      label: "More",
      href: "/more",
    },
  ],
};

export default siteConfig;
export type SiteConfig = typeof siteConfig;
