"use client";

import { useState } from "react";

export const useChangeSidebarList = () => {
    const [isDisplayFriends, setIsDisplayFriends] = useState(false);
    const [isDisplayChats, setIsDisplayChats] = useState(true);
    const [isDisplayFriendshipRequests, setIsDisplayFriendshipRequests] = useState(false);
    
    const handleChangeToFriends = () => {
        setIsDisplayChats(false);
        setIsDisplayFriendshipRequests(false);
        setIsDisplayFriends(true);

    };

    const handleChangeToChats = () => {
        setIsDisplayFriends(false);
        setIsDisplayFriendshipRequests(false);
        setIsDisplayChats(true);
    };

    const handleChangeToFriendshipRequests = () => {
        setIsDisplayFriends(false);
        setIsDisplayChats(false);
        setIsDisplayFriendshipRequests(true);
    };

    return {
        isDisplayFriends,
        isDisplayChats,
        isDisplayFriendshipRequests,
        handleChangeToChats,
        handleChangeToFriends,
        handleChangeToFriendshipRequests,
    };
};
