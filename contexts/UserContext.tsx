import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePrivy } from "@privy-io/react-auth";

interface TokenHolderList {
    array: Array<any>; // Replace `any` with more specific type if known
    length: number;
}

interface TokenDetails {
    tokenSupply: number;
    tokenName: string;
    priceETH: number;
    priceUSD: number;
    totalTrades: number;
    curveETH: number;
    volume: number;
    totalUserFees: number;
    totalProtocolFees: number;
    tokenHolders: TokenHolderList;
}

interface TokensOwned {
    array: Array<any>; // Replace `any` with more specific type if known
    length: number;
}

interface UserProfile {
    profileName: string;
    username: string;
    tokensOwned: TokensOwned;
    tokenDetails: TokenDetails;
}

const UserContext = createContext<UserProfile | null>(null);  // Define `UserProfile` as per the shape of user info data

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
    const { user } = usePrivy();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user?.id) {
                try {
                    const url = `/api/get-user-info?privyId=${encodeURIComponent(user.id)}`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setUserInfo(data);
                } catch (error) {
                    console.error('Failed to fetch user info', error);
                }
            } else {
                console.error('Privy ID is required to fetch user info');
            }
        };

        fetchUserInfo();
    }, [user?.id]); // Dependency on user?.id to refetch when it changes

    return (
        <UserContext.Provider value={userInfo}>
            {children}
        </UserContext.Provider>
    );
};
