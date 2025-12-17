/**
 * Parses PubMed URLs to extract search queries and PMIDs
 */

export interface ParsedPubMedUrl {
    type: 'query' | 'pmid' | 'invalid';
    query?: string;
    pmids?: string[];
    error?: string;
}

/**
 * Parse a PubMed URL and extract relevant information
 * @param url - The PubMed URL to parse
 * @returns ParsedPubMedUrl object containing the parsed information
 */
export function parsePubMedUrl(url: string): ParsedPubMedUrl {
    try {
        // Validate that it's a PubMed URL
        if (!url.includes('pubmed.ncbi.nlm.nih.gov')) {
            return {
                type: 'invalid',
                error: 'Invalid URL: Must be a PubMed URL (pubmed.ncbi.nlm.nih.gov)'
            };
        }

        const urlObj = new URL(url);

        // Check if it's a search query URL
        const termParam = urlObj.searchParams.get('term');
        if (termParam) {
            return {
                type: 'query',
                query: termParam
            };
        }

        // Check if it's a specific article or list of articles by PMID
        const pathMatch = urlObj.pathname.match(/\/(\d+(?:,\d+)*)\/?$/);
        if (pathMatch) {
            const pmids = pathMatch[1].split(',');
            return {
                type: 'pmid',
                pmids
            };
        }

        return {
            type: 'invalid',
            error: 'Could not extract search query or PMIDs from URL'
        };
    } catch (error) {
        return {
            type: 'invalid',
            error: 'Invalid URL format'
        };
    }
}

/**
 * Generate a suggested category title from a search query
 * @param query - The PubMed search query
 * @returns A suggested human-readable title
 */
export function generateCategoryTitle(query: string): string {
    // Try to extract journal names from the query
    const journalPattern = /"([^"]+)"\[jo\]/gi;
    const matches = [...query.matchAll(journalPattern)];

    if (matches.length > 0) {
        // If we have journal names, create a descriptive title
        const firstJournal = matches[0][1];

        // Try to identify the category based on keywords in the journals
        const queryLower = query.toLowerCase();

        if (queryLower.includes('pediatr') || queryLower.includes('child')) {
            return 'General Pediatrics';
        } else if (queryLower.includes('vaccine') || queryLower.includes('immun')) {
            return 'Vaccine Research';
        } else if (queryLower.includes('infect')) {
            return 'Infectious Disease';
        } else if (queryLower.includes('travel')) {
            return 'Travel Medicine';
        } else {
            // Use the first journal name as a fallback
            return firstJournal.split(' ')[0] + ' Journals';
        }
    }

    // If no journal names, try to use the query itself
    const cleanQuery = query
        .replace(/\[jo\]/gi, '')
        .replace(/["\[\]()]/g, '')
        .replace(/\s+or\s+/gi, ', ')
        .replace(/\s+and\s+/gi, ' & ')
        .trim();

    return cleanQuery.length > 50
        ? cleanQuery.substring(0, 47) + '...'
        : cleanQuery || 'Custom Search';
}

/**
 * Suggest an icon ID based on the category title or query
 * @param title - The category title
 * @param query - The search query (optional)
 * @returns An icon ID that matches the existing icon set
 */
export function suggestIconId(title: string, query?: string): string {
    const combinedText = (title + ' ' + (query || '')).toLowerCase();

    if (combinedText.includes('pediatr') || combinedText.includes('child')) {
        return 'pediatric';
    } else if (combinedText.includes('vaccine') || combinedText.includes('immun')) {
        return 'vaccine';
    } else if (combinedText.includes('travel')) {
        return 'travel';
    } else if (combinedText.includes('infect') || combinedText.includes('disease')) {
        return 'general';
    }

    return 'general'; // Default fallback
}
