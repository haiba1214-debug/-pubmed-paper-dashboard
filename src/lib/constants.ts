export const SEARCH_QUERIES = [
    {
        id: 'vaccine',
        label: 'Vaccine Journals',
        query: `("Vaccine"[jo] OR "Hum Vaccin Immunother"[jo] OR "NPJ Vaccines"[jo] OR "Vaccine X"[jo] OR "Vaccines (Basel)"[jo] OR "Expert Rev Vaccines"[jo])`
    },
    {
        id: 'pediatric',
        label: 'Pediatric ID',
        query: `Pediatr Infect Dis J[Jo] OR "J Pediatric Infect Dis Soc"[Jo]`
    },
    {
        id: 'general',
        label: 'General ID',
        query: `("Lancet Infect Dis"[jo] or "Clin Infect Dis"[jo] or "Emerg Infect Dis"[jo] or "J Infect"[jo] or "Nat Rev Microbiol"[jo] or "Nat Rev Immunol"[jo] or "J Antimicrob Chemother"[jo] or "Int J Antimicrob Agents"[jo] or "Travel Med Infect Dis"[jo] or "Open Forum Infect Dis"[jo] or "J Clin Microbiol"[jo] or "Clin Microbiol Rev"[jo] or "Med Mycol"[jo] or "Mycoses"[jo] or "Vector Borne Zoonotic Dis"[jo] or "Antimicrob Agents Chemother"[jo] or "Microbiome"[jo] or "Ther Adv Infect Dis"[jo] or "BMC Infect Dis"[jo] or "J Hosp Infect"[jo] or "Infect Dis Clin North Am"[jo] or "PLoS Pathog"[jo] or "Virulence"[jo] or "mBio"[jo] or "J Virol"[jo] or "Euro Surveill"[jo] or "Lancet HIV"[jo] or "J Travel Med"[jo] or "Infect Immun"[jo] or "Pathog Dis"[jo])`
    },
    {
        id: 'travel',
        label: 'Travel Medicine',
        query: `"J Travel Med"[jo] OR "Travel Med Infect Dis"[jo] OR "Am J Trop Med Hyg"[jo] OR "Trans R Soc Trop Med Hyg"[jo] OR "Int J Travel Med Glob Health"[jo]`
    }
];

export interface QueryItem {
    id: string;
    label: string;
    query: string;
    iconId?: string; // Optional icon identifier for custom categories
}


export interface PubMedArticle {
    uid: string;
    title: string;
    source: string; // Journal
    pubdate: string;
    authors: { name: string }[];
    elocationid?: string; // DOI often here
    fulljournalname?: string;
    sortdate?: string;
}

export interface SearchResult {
    uids: string[];
    total: number;
}
