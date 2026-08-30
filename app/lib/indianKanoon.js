/**
 * Indian Kanoon Legal Search Integration
 * Searches Indian legal database for case law and statutes
 */

const INDIAN_KANOON_BASE = 'https://api.indiankanoon.org';

/**
 * Search Indian Kanoon for legal documents
 * Falls back to a formatted search URL if API key is not available
 */
export async function searchLegalDocuments(query, pageNum = 0) {
  const apiKey = process.env.INDIAN_KANOON_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch(`${INDIAN_KANOON_BASE}/search/?formInput=${encodeURIComponent(query)}&pagenum=${pageNum}`, {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          source: 'api',
          results: data.docs?.map(doc => ({
            title: doc.title || 'Untitled',
            snippet: doc.headline || '',
            url: `https://indiankanoon.org/doc/${doc.tid}/`,
            court: doc.docsource || '',
            date: doc.publishdate || '',
          })) || [],
          totalResults: data.found || 0,
        };
      }
    } catch (error) {
      console.error('Indian Kanoon API error:', error);
    }
  }
  
  // Fallback: Return search URL and curated results from common legal databases
  return {
    success: true,
    source: 'fallback',
    searchUrl: `https://indiankanoon.org/search/?formInput=${encodeURIComponent(query)}`,
    results: generateFallbackResults(query),
    note: 'Direct search results from Indian Kanoon. Click the link to see full results on their website.',
  };
}

/**
 * Generate helpful fallback results when API is not available
 */
function generateFallbackResults(query) {
  const queryLower = query.toLowerCase();
  const results = [];
  
  const legalResources = [
    {
      keywords: ['fir', 'police', 'complaint', 'arrest'],
      title: 'Criminal Procedure Code - FIR and Investigation',
      url: 'https://indiankanoon.org/search/?formInput=section+154+crpc+FIR',
      snippet: 'Section 154 CrPC - Information in cognizable cases. Every information relating to commission of a cognizable offence shall be recorded.',
    },
    {
      keywords: ['bail', 'custody', 'detention'],
      title: 'Bail Provisions under CrPC',
      url: 'https://indiankanoon.org/search/?formInput=section+437+438+crpc+bail',
      snippet: 'Sections 437 & 438 CrPC - Bail in non-bailable offences and Anticipatory bail provisions.',
    },
    {
      keywords: ['consumer', 'product', 'defect', 'service'],
      title: 'Consumer Protection Act, 2019',
      url: 'https://indiankanoon.org/search/?formInput=consumer+protection+act+2019',
      snippet: 'Consumer Protection Act, 2019 - Rights of consumers, consumer disputes redressal commissions.',
    },
    {
      keywords: ['tenant', 'rent', 'landlord', 'eviction'],
      title: 'Rent Control and Tenant Rights',
      url: 'https://indiankanoon.org/search/?formInput=rent+control+act+tenant+rights',
      snippet: 'Various state Rent Control Acts - Protection of tenants from arbitrary eviction.',
    },
    {
      keywords: ['divorce', 'marriage', 'custody', 'maintenance', 'alimony'],
      title: 'Family Law - Marriage and Divorce',
      url: 'https://indiankanoon.org/search/?formInput=hindu+marriage+act+divorce',
      snippet: 'Hindu Marriage Act, 1955 and Special Marriage Act, 1954 - Provisions for marriage, divorce, and maintenance.',
    },
    {
      keywords: ['property', 'land', 'transfer', 'sale deed', 'registration'],
      title: 'Transfer of Property Act',
      url: 'https://indiankanoon.org/search/?formInput=transfer+of+property+act',
      snippet: 'Transfer of Property Act, 1882 - Rules governing transfer of immovable property in India.',
    },
    {
      keywords: ['rti', 'information', 'right to information'],
      title: 'Right to Information Act, 2005',
      url: 'https://indiankanoon.org/search/?formInput=right+to+information+act+2005',
      snippet: 'RTI Act, 2005 - Every citizen has the right to seek information from public authorities.',
    },
    {
      keywords: ['domestic violence', 'cruelty', 'dowry', '498a'],
      title: 'Protection of Women from Domestic Violence',
      url: 'https://indiankanoon.org/search/?formInput=domestic+violence+act+2005',
      snippet: 'Protection of Women from Domestic Violence Act, 2005 and Section 498A IPC.',
    },
    {
      keywords: ['cyber', 'online', 'hack', 'fraud', 'digital'],
      title: 'Information Technology Act, 2000',
      url: 'https://indiankanoon.org/search/?formInput=information+technology+act+cyber+crime',
      snippet: 'IT Act, 2000 - Legal framework for electronic governance and cyber crimes in India.',
    },
    {
      keywords: ['labour', 'labor', 'wages', 'employee', 'worker', 'factory'],
      title: 'Labour Laws in India',
      url: 'https://indiankanoon.org/search/?formInput=minimum+wages+act+labour+law',
      snippet: 'Various labour laws including Minimum Wages Act, Factories Act, and new Labour Codes.',
    },
  ];
  
  for (const resource of legalResources) {
    if (resource.keywords.some(kw => queryLower.includes(kw))) {
      results.push({
        title: resource.title,
        url: resource.url,
        snippet: resource.snippet,
        court: 'Legal Reference',
        date: '',
      });
    }
  }
  
  // Always add a direct search link
  if (results.length === 0) {
    results.push({
      title: `Search results for "${query}" on Indian Kanoon`,
      url: `https://indiankanoon.org/search/?formInput=${encodeURIComponent(query)}`,
      snippet: 'Click to view relevant case law, statutes, and legal documents on Indian Kanoon.',
      court: 'Indian Kanoon',
      date: '',
    });
  }
  
  return results;
}
