'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
    href: string;
    children: ReactNode;
    style?: React.CSSProperties;
}

export function NavLink({ href, children, style }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    const activeStyle: React.CSSProperties = {
        color: 'var(--text-primary)', // Darker/Main black
        fontWeight: 'bold',
        ...style
    };

    const inactiveStyle: React.CSSProperties = {
        color: 'var(--text-secondary)',
        ...style
    };

    return (
        <Link href={href} style={isActive ? activeStyle : inactiveStyle}>
            {children}
        </Link>
    );
}
