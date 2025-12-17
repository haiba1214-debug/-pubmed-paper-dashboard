import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'pubmed-favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
            return new Set();
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }, [favorites]);

    const addFavorite = (uid: string) => {
        setFavorites(prev => new Set(prev).add(uid));
    };

    const removeFavorite = (uid: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            next.delete(uid);
            return next;
        });
    };

    const toggleFavorite = (uid: string) => {
        if (favorites.has(uid)) {
            removeFavorite(uid);
        } else {
            addFavorite(uid);
        }
    };

    const isFavorite = (uid: string) => {
        return favorites.has(uid);
    };

    const getFavorites = () => {
        return Array.from(favorites);
    };

    return {
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        getFavorites,
        favorites: Array.from(favorites),
    };
}
