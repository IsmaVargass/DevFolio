# DevFolio - Communities & Job Listings

## Adzuna API Integration

### What is Adzuna?

Adzuna is a job search engine that aggregates job listings from thousands of sources worldwide. We use their API to display **real IT/Programming job opportunities** in Spain directly within DevFolio's Communities section.

### How the Integration Works

#### 1. API Credentials

To use the Adzuna API, you need free API credentials:

```javascript
const ADZUNA_APP_ID = '3fc224ea';
const ADZUNA_APP_KEY = '4c352b45d620647c60abf49c26aa0381';
```

**How to get your own credentials:**
1. Visit https://developer.adzuna.com/
2. Sign up for a free account
3. Create a new application
4. Copy your `app_id` and `app_key`
5. Replace the values in `js/communities.js`

#### 2. API Endpoint

We use the Spanish jobs endpoint:

```
https://api.adzuna.com/v1/api/jobs/es/search/{page}
```

- **Country Code**: `es` (Spain)
- **Page**: Pagination number (we use page  1)
- **Results per page**: 20 jobs

#### 3. Category Filtering

To show **only IT/Programming jobs**, we use the category filter:

```javascript
const category = 'it-jobs';
```

This ensures users only see jobs related to:
- Software Development
- Programming
- IT Infrastructure
- Web Development
- System Administration
- Tech Support
- And other IT-related positions

#### 4. Request Parameters

The complete API request includes:

```javascript
const url = `${ADZUNA_API_BASE}/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=${resultsPerPage}&content-type=application/json&category=${category}`;
```

**Optional filters added by user:**
- `what` - Keyword search (e.g., "javascript", "react", "senior developer")
- `where` - Location filter (e.g., "Madrid", "Barcelona")

Example with filters:
```
https://api.adzuna.com/v1/api/jobs/es/search/1?
  app_id=YOUR_ID&
  app_key=YOUR_KEY&
  results_per_page=20&
  content-type=application/json&
  category=it-jobs&
  what=javascript&
  where=Madrid
```

#### 5. API Response Structure

The API returns a JSON object with this structure:

```json
{
  "results": [
    {
      "id": "1234567890",
      "title": "Senior JavaScript Developer",
      "company": {
        "display_name": "Tech Company S.L."
      },
      "location": {
        "display_name": "Madrid"
      },
      "description": "Full job description...",
      "created": "2025-12-01T10:30:00Z",
      "contract_time": "full_time",
      "salary_min": 35000,
      "salary_max": 50000,
      "redirect_url": "https://www.adzuna.es/jobs/land/ad/..."
    }
  ],
  "count": 150,
  "mean": 42500
}
```

#### 6. Implementation in DevFolio

**File**: `js/communities.js`

```javascript
// Fetch jobs from Adzuna
async function fetchAdzunaJobs(keyword = '', location = '') {
    const page = 1;
    const resultsPerPage = 20;
    
    // IT jobs filter
    const category = 'it-jobs';
    
    let url = `${ADZUNA_API_BASE}/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=${resultsPerPage}&content-type=application/json&category=${category}`;
    
    // Add user filters
    if (keyword) {
        url += `&what=${encodeURIComponent(keyword)}`;
    }
    
    if (location) {
        url += `&where=${encodeURIComponent(location)}`;
    }
    
    // Make API request
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
}
```

#### 7. Error Handling

We implemented comprehensive error handling:

- **Loading State**: Shows spinner while fetching
- **Network Errors**: Displays user-friendly error message
- **Empty Results**: Shows message when no jobs match filters
- **API Limits**: Free tier has rate limits (contact Adzuna for details)

#### 8. Job Card Click Behavior

When users click a job card, they are redirected to the full job posting on Adzuna's website:

```javascript
onclick="window.open('${job.redirect_url}', '_blank')"
```

This opens the complete job listing in a new tab, allowing users to apply directly through Adzuna.

### Benefits of Using Adzuna

1. **Real Jobs**: Actual job postings from real companies
2. **Always Updated**: Jobs are aggregated from multiple sources daily
3. **International Reach**: While we filter for Spain, Adzuna covers 19 countries
4. **Free Tier**: Generous free tier for development and small projects
5. **Rich Metadata**: Salary info, contract types, locations, company details
6. **IT Focus**: Easy category filtering for tech jobs only

### API Rate Limits

**Free Tier:**
- 500 calls per month
- Enough for ~25 users searching 20 times each per month
- For production apps with more traffic, consider Adzuna's paid plans

### Testing the Integration

1. Open DevFolio Communities page
2. Go to "Ofertas de Trabajo" tab
3. Jobs should load automatically (IT/Programming only, Spain)
4. Try filtering:
   - Enter "react" in keyword field → Click "Buscar"
   - Select "Barcelona" from location dropdown → Click "Buscar"
5. Click any job card → Opens full listing in new tab

### Troubleshooting

**No jobs loading?**
- Check browser console for errors
- Verify API credentials are correct
- Check internet connection
- Ensure Adzuna API is not down (visit https://status.adzuna.com/)

**Jobs showing but from wrong category?**
- Verify `category: 'it-jobs'` is in the URL
- Some job sources may mis-categorize positions

**Rate limit exceeded?**
- Wait until next month (free tier resets monthly)
- Consider upgrading to paid plan
- Implement caching to reduce API calls

---

## Communities Features Overview

DevFolio Communities has 4 main tabs:

### 1. Portfolios Recientes
- View recently published portfolios
- Click to see complete CV in modal
- Send messages to portfolio owners

### 2. Portfolios Destacados  
- Portfolios ranked by total views
- View count tracking
- Only shows portfolios with 1+ views

### 3. Ofertas de Trabajo (Adzuna powered)
- Real IT jobs from Spain
- Keyword and location filtering
- Direct links to job postings
- **No user job posting** (all jobs from Adzuna)

### 4. Grupos de Trabajo
- Join work groups by topic
- Announce your portfolio to group members
- Create discussion threads
- View group members (only shows you when joined)
- Leave groups

---

## Contact & Support

For issues with the Adzuna API:
- Documentation: https://developer.adzuna.com/docs/search
- Support: https://www.adzuna.com/contact

For DevFolio issues:
- Use the in-app Customer Support feature
- Check the FAQ section

---

**Last Updated**: December 2025
**Adzuna API Version**: v1
**DevFolio Version**: 1.0