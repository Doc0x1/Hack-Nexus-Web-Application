import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

export default function UserSessionProvider({ session, children }: { session: Session; children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
