export const MENU: { id: string; label: string; href: string; mega?: boolean }[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About Us', href: '/about' },
  { id: 'products', label: 'Products', href: '/products/imaging', mega: true },
  { id: 'projects', label: 'Hospital Projects', href: '/projects' },
  { id: 'resources', label: 'Resources', href: '/resources' },
  { id: 'clients', label: 'Projects / Clients', href: '/clients' },
  { id: 'contact', label: 'Contact Us', href: '/contact' },
];

export function activeMenuId(pathname: string): string {
  const seg = pathname.split('/')[1] || 'home';
  if (seg === 'product') return 'products';
  if (seg === 'project') return 'projects';
  return seg;
}
