export const isSectionRoute = (pathname, href) =>
  pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
