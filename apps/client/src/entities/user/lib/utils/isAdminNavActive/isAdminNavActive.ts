/** Активное состояние ссылок админки в сайдбаре и шапке. */
export const isAdminNavActive = (pathname: string, href: string): boolean => {
  if (href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};
