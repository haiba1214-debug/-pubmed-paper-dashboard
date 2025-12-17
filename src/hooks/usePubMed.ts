import { useState, useEffect } from 'react';
import type { PubMedArticle } from '../lib/constants';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export function usePubMed(query: string, delay: number = 0, shouldFetch: boolean = true) {
    const [articles, setArticles] = useState<PubMedArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [idList, setIdList] = useState<string[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (!query || !shouldFetch) return;

        let mounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;

        const initialFetch = async (retryCount = 0): Promise<void> => {
            try {
                if (delay > 0 && retryCount === 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                if (retryCount > 0) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                // 1. Search for a larger list of IDs (e.g., 100)
                const searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=100&sort=date`;
                const searchRes = await fetch(searchUrl);
                if (!searchRes.ok) throw new Error('Failed to search PubMed');
                const searchData = await searchRes.json();
                const ids: string[] = searchData.esearchresult?.idlist || [];

                if (mounted) {
                    setIdList(ids);
                    if (ids.length === 0) {
                        setArticles([]);
                        setHasMore(false);
                    } else {
                        // Fetch first batch
                        await fetchSummaries(ids.slice(0, 10));
                        setLoadedCount(10);
                        setHasMore(ids.length > 10);
                    }
                }

            } catch (err: any) {
                if (retryCount < 1 && mounted) {
                    console.log('Retrying initial fetch for query:', query);
                    await initialFetch(retryCount + 1);
                    return;
                }
                if (mounted) setError(err.message || 'Unknown error');
            }
        };

        const fetchSummaries = async (idsToFetch: string[]) => {
            if (idsToFetch.length === 0) return;
            const summaryUrl = `${BASE_URL}/esummary.fcgi?db=pubmed&id=${idsToFetch.join(',')}&retmode=json`;
            const summaryRes = await fetch(summaryUrl);
            if (!summaryRes.ok) throw new Error('Failed to fetch summaries');
            const summaryData = await summaryRes.json();

            const result = summaryData.result || {};
            const uids = result.uids || [];

            const fetchedArticles = uids.map((uid: string) => {
                const item = result[uid];
                return {
                    uid,
                    title: item.title,
                    source: item.source,
                    pubdate: item.pubdate,
                    authors: item.authors || [],
                    elocationid: item.elocationid,
                    fulljournalname: item.fulljournalname,
                    sortdate: item.sortdate
                } as PubMedArticle;
            });

            if (mounted) {
                setArticles(prev => {
                    // Avoid duplicates
                    const existingUids = new Set(prev.map((a: PubMedArticle) => a.uid));
                    const newArticles = fetchedArticles.filter((a: PubMedArticle) => !existingUids.has(a.uid));
                    return [...prev, ...newArticles];
                });
            }
        };

        const executeFetch = async () => {
            setLoading(true);
            setError(null);
            setArticles([]);
            await initialFetch(0);
            if (mounted) setLoading(false);
        };

        timeoutId = setTimeout(executeFetch, 100);

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
        };
    }, [query, delay, shouldFetch]);

    const loadMore = async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const nextBatch = idList.slice(loadedCount, loadedCount + 10);
            if (nextBatch.length > 0) {
                const summaryUrl = `${BASE_URL}/esummary.fcgi?db=pubmed&id=${nextBatch.join(',')}&retmode=json`;
                const summaryRes = await fetch(summaryUrl);
                if (!summaryRes.ok) throw new Error('Failed to fetch more summaries');
                const summaryData = await summaryRes.json();

                const result = summaryData.result || {};
                const uids = result.uids || [];

                const fetchedArticles = uids.map((uid: string) => {
                    const item = result[uid];
                    return {
                        uid,
                        title: item.title,
                        source: item.source,
                        pubdate: item.pubdate,
                        authors: item.authors || [],
                        elocationid: item.elocationid,
                        fulljournalname: item.fulljournalname,
                        sortdate: item.sortdate
                    } as PubMedArticle;
                });

                setArticles(prev => [...prev, ...fetchedArticles]);
                setLoadedCount(prev => prev + 10);
                setHasMore(loadedCount + 10 < idList.length);
            } else {
                setHasMore(false);
            }
        } catch (err: any) {
            setError(err.message || 'Error loading more');
        } finally {
            setLoading(false);
        }
    };

    return { articles, loading, error, hasMore, loadMore };
}
