'use client';
import { useSearchParams, useRouter }_from 'next/navigation';
import { useEffect } from 'react';
import { EchoApp } from '@/components/echo-app';

export default function ProtectedApp() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const redirectPath = searchParams.get('p');
        if (redirectPath) {
            // Use replace to avoid adding the redirect URL to the history stack.
            // The path is already prefixed with /echo from the 404 page,
            // so we just need to handle the hash.
            const newUrl = window.location.pathname.replace(/\/\?p=.*$/, '') + '#' + redirectPath.substring(1);
             // We need to use window.location.replace to correctly handle the basePath
            window.location.replace(newUrl);
        }
    }, [searchParams, router]);

    // Guest mode is the only mode, so we always show the app.
    return <EchoApp />;
}
