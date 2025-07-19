'use client';

import { EchoApp } from '@/components/echo-app';

export default function ProtectedApp() {
    // Guest mode is the only mode, so we always show the app.
    return <EchoApp />;
}
