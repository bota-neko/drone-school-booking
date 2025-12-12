import Link from 'next/link';
import { NavLink } from '@/components/ui/nav-link';
import { verifySession } from '@/lib/session';
import { LogoutButton } from '@/components/layout/logout-button';

import { getSystemConfig } from '@/app/actions/settings';

export async function SiteHeader() {
    const session = await verifySession();
    const isAuth = !!session?.isAuth;
    const config = await getSystemConfig();

    // Icons
    const CalendarIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    );
    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    );
    const LogOutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    );
    const LogInIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
    );
    const UserPlusIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
    );
    const DashboardIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    );
    const ListIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
    );
    const SettingsIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    );

    return (
        <header style={{
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1rem 0'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem'
            }}>
                {/* Brand / Logo */}
                <Link href="/calendar" style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-outfit)',
                    letterSpacing: '-0.02em',
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    {config.logoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={config.logoUrl}
                            alt="Logo"
                            style={{
                                height: '32px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                    <span>{config.siteTitle}</span>
                </Link>

                {/* Navigation */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                    {/* Calendar: Visible to Guests and Standard Users (Not Admins) */}
                    {!session?.role || session.role !== 'ADMIN' ? (
                        <NavLink href="/calendar" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>予約カレンダー</span>
                            <CalendarIcon />
                        </NavLink>
                    ) : null}

                    {isAuth ? (
                        <>
                            {/* My Calendar: Visible to Standard Users ONLY */}
                            {session?.role !== 'ADMIN' && (
                                <NavLink href="/my-page" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>マイカレンダー</span>
                                    <UserIcon />
                                </NavLink>
                            )}

                            {/* Admin Links: Visible to Admin ONLY */}
                            {session?.role === 'ADMIN' && (
                                <>
                                    <NavLink href="/admin" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>ダッシュボード</span>
                                        <DashboardIcon />
                                    </NavLink>
                                    <NavLink href="/admin/calendar" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>カレンダー</span>
                                        <CalendarIcon />
                                    </NavLink>
                                    <NavLink href="/admin/bookings" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>予約一覧</span>
                                        <ListIcon />
                                    </NavLink>
                                    <NavLink href="/admin/users" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>ユーザー管理</span>
                                        <UserIcon />
                                    </NavLink>
                                    <NavLink href="/admin/settings" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>設定</span>
                                        <SettingsIcon />
                                    </NavLink>
                                </>
                            )}

                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn" style={{
                                fontSize: '0.8rem',
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>ログイン</span>
                                <LogInIcon />
                            </Link>
                            <Link href="/register" className="btn btn-primary" style={{
                                fontSize: '0.8rem',
                                padding: '0.5rem 1rem',
                                textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>新規登録</span>
                                <UserPlusIcon />
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
