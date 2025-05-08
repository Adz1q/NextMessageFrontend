"use client";

import { useState } from "react";

export const useChangeSidebarList = () => {
    const [isDisplayFriends, setIsDisplayFriends] = useState(false);
    
    const handleChangeToFriends = () => {
        setIsDisplayFriends(true);
    };

    const handleChangeToChats = () => {
        setIsDisplayFriends(false);
    };

    return {
        isDisplayFriends,
        handleChangeToChats,
        handleChangeToFriends,
    };
};
