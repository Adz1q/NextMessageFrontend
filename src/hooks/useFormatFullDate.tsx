"use client";

import { useEffect, useState } from "react";

export const useFormatFullDate = (providedDate: string) => {
    const [displayedDate, setDisplayedDate] = useState("");
    const [isDisplayed, setIsDisplayed] = useState(false);

    useEffect(() => {
        const formatDate = () => {
            const currentDate = new Date();
            const date = new Date(providedDate);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            
            const dateDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            const dateMonth = monthNames[date.getMonth()];
            const dateYear = date.getFullYear();
            const dateHours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const dateMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

            const currentDay = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
            const currentMonth = monthNames[currentDate.getMonth()];
            const currentYear = currentDate.getFullYear();
            
            if (currentDay === dateDay && currentMonth === dateMonth && currentYear === dateYear) {
                setDisplayedDate(`${dateHours}:${dateMinutes}`);
            } 
            else if (currentDay !== dateDay || currentMonth !== dateMonth && currentYear === dateYear) {
                setDisplayedDate(`${dateDay} ${dateMonth}`);
            } 
            else {
                setDisplayedDate(`${dateDay} ${dateMonth} ${dateYear}`);
            }
        };

        formatDate();

        const interval = setInterval(formatDate, 1000 * 60 * 60);

        return () => {
            clearInterval(interval);
        };
    }, [providedDate]);

    return { displayedDate, isDisplayed, setIsDisplayed };
};
