import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'tr'] as const;

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales });
