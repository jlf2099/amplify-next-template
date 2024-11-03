"use client";

import {fetchAuthSession, getCurrentUser, signOut} from "aws-amplify/auth";
import {useRouter} from "next/navigation";
import {ReactElement, useEffect} from "react";
import {fetchFromApi} from "@/app/utils/api";
import {configureAmplify, getAuthRedirectUrl} from "@/app/utils/amplifyConfig";
import Layout from "@/app/components/Layout";
import {clearAllCookies, updateUserTypeCookie} from "@/app/utils/cookieManager";

export const dynamic = 'force-dynamic';

function CallbackWrapper({children}: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        async function handleAuthCallback() {
            try {
                configureAmplify('user');
                // セッションとユーザー情報の確認
                const [session, currentUser] = await Promise.all([
                    fetchAuthSession(),
                    getCurrentUser()
                ]);

                if (!session.tokens || !currentUser) {
                    clearAllCookies();
                    window.location.href = `${process.env.NEXT_PUBLIC_USER_POOL_SIGNIN_URL}/?redirect_uri=${getAuthRedirectUrl('user')}`;
                    return;
                }

                updateUserTypeCookie('user');
                await fetchFromApi('/users', 'POST');
                router.push('/users/channels');
            } catch (error) {
                console.error("Authentication error:", error);

                if (error instanceof Error && error.message.includes("There is already a signed in user")) {
                    await signOut();
                    window.location.reload();
                    return;
                }

                router.push('/');
            }
        }

        void handleAuthCallback();
    }, [router]);

    return <>{children}</>;
}

export default function AuthCallback(): ReactElement {
    return (
        <Layout>
            <CallbackWrapper>
                <div className="w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Authenticating...
                        </h2>
                    </div>
                </div>
            </CallbackWrapper>
        </Layout>
    );
}
