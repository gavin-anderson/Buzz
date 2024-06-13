// components/SessionHandler.tsx
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";

function SessionHandler() {
    const { ready, authenticated, user } = usePrivy();
    const router = useRouter();

    async function createUser() {
        if (user && user.wallet && (user.email || user.google)) {
            try {
                const _email = user.email?.address ?? user.google?.email;
                const _profileName = user.google?.name || _email.split('@')[0];
                const _username = "@" + _profileName.replace(/\s+/g, '_');

                const response = await fetch('/api/create-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        walletAddress: user.wallet.address,
                        privy_id: user.id,
                        username: _username,  
                        profileName: _profileName,  
                        createdAt: user.createdAt,
                        email: _email
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('User creation successful:', result);
                } else {
                    throw new Error('Failed to create user');
                }
            } catch (error) {
                console.error('Error creating user:', error);
            }
        } else {
            console.log("User, wallet, or email data is incomplete or not loaded.");
        }
    }

    useEffect(() => {
        console.log(`Ready: ${ready}, Authenticated: ${authenticated}, User:`, user);
        
        if (ready && authenticated && user) {
            createUser();
        }
    }, [ready, authenticated, user]);

    return null; // This component does not render anything
}

export default SessionHandler;
