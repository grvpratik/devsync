// class ServiceIntegration {
// 	market_prompt = `
//       Given this product/app idea: "${userIdea}"
//       Generate the following for Reddit market research:
//       1. Most relevant subreddits to search
//       2. Key search terms or phrases
//       3. Time period to analyze (in days)
//       Format as JSON with keys: subreddits (array), search_terms (array), time_period (number)
//     `;

// 	feature_prompt = `
//       Given this product/app idea: "${userIdea}"
//       Generate the following for GitHub research:
//       1. Key technical features to search for
//       2. Relevant programming languages
//       3. Topics or tags to include
//       Format as JSON with keys: features (array), languages (array), topics (array)
//     `;

// 	trends_prompt = `
//       Given this product/app idea: "${userIdea}"
//       Generate the following for Google Trends research:
//       1. Main search terms to analyze
//       2. Related terms to compare
//       3. Time period to analyze (in months)
//       Format as JSON with keys: main_terms (array), related_terms (array), time_period (number)
//     `;
// 	constructor(gemini) {}
// }

// class IdeaValidator {
//   constructor(geminiApiKey, redditApiKey, githubApiKey, googleApiKey) {
//     this.geminiApiKey = geminiApiKey;
//     this.googleApiKey = googleApiKey;
//     this.redditHeaders = {
//       'Authorization': `Bearer ${redditApiKey}`,
//       'User-Agent': 'IdeaValidator/1.0'
//     };
//     this.githubHeaders = {
//       'Authorization': `token ${githubApiKey}`,
//       'Accept': 'application/vnd.github.v3+json'
//     };
//   }

//   async generateTrendsQuery(userIdea) {
//     const prompt = `
//       Given this product/app idea: "${userIdea}"
//       Generate the following for Google Trends research:
//       1. Main search terms to analyze
//       2. Related terms to compare
//       3. Time period to analyze (in months)
//       Format as JSON with keys: main_terms (array), related_terms (array), time_period (number)
//     `;

//     const response = await this.callGeminiAPI(prompt);
//     return response;
//   }

//   async searchGoogleTrends(queryParams) {
//     const { main_terms, related_terms, time_period } = queryParams;
//     const results = [];

//     // Calculate date range
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setMonth(startDate.getMonth() - time_period);

//     // Format dates for API
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     for (const term of [...main_terms, ...related_terms]) {
//       const url = `https://trends.googleapis.com/trends/api/dailytrends?` +
//         `hl=en-US&` +
//         `term=${encodeURIComponent(term)}&` +
//         `geo=US&` +
//         `date=${formatDate(startDate)}&` +
//         `end=${formatDate(endDate)}&` +
//         `key=${this.googleApiKey}`;

//       const response = await fetch(url);
//       const data = await response.json();

//       // Process and format trends data
//       const trendData = {
//         term,
//         interest_over_time: this.processTrendsData(data),
//         related_queries: await this.getRelatedQueries(term)
//       };

//       results.push(trendData);
//     }

//     return results;
//   }

//   async getRelatedQueries(term) {
//     const url = `https://trends.googleapis.com/trends/api/queries/related?` +
//       `hl=en-US&` +
//       `q=${encodeURIComponent(term)}&` +
//       `geo=US&` +
//       `key=${this.googleApiKey}`;

//     const response = await fetch(url);
//     const data = await response.json();
//     return this.processRelatedQueries(data);
//   }

//   processTrendsData(data) {
//     // Process raw trends data into a more usable format
//     return data.default.timelineData.map(point => ({
//       date: point.date,
//       value: point.value[0],
//       formattedValue: point.formattedValue[0]
//     }));
//   }

//   processRelatedQueries(data) {
//     // Process related queries data
//     return {
//       rising: data.default.rankedList[0].rankedKeyword,
//       top: data.default.rankedList[1].rankedKeyword
//     };
//   }

//   // ... (previous methods remain the same)

//   async validateIdea(userIdea) {
//     try {
//       // Generate queries using Gemini AI
//       const [marketQuery, featureQuery, trendsQuery] = await Promise.all([
//         this.generateMarketResearchQuery(userIdea),
//         this.generateFeatureResearchQuery(userIdea),
//         this.generateTrendsQuery(userIdea)
//       ]);

//       // Execute searches in parallel
//       const [redditResults, githubResults, trendsResults] = await Promise.all([
//         this.searchReddit(marketQuery),
//         this.searchGithub(featureQuery),
//         this.searchGoogleTrends(trendsQuery)
//       ]);

//       // Analyze trends data
//       const trendsAnalysis = this.analyzeTrendsData(trendsResults);

//       return {
//         market_research: {
//           query_params: marketQuery,
//           results: redditResults
//         },
//         feature_research: {
//           query_params: featureQuery,
//           results: githubResults
//         },
//         trends_research: {
//           query_params: trendsQuery,
//           results: trendsResults,
//           analysis: trendsAnalysis
//         }
//       };
//     } catch (error) {
//       console.error('Error validating idea:', error);
//       throw error;
//     }
//   }

//   analyzeTrendsData(trendsResults) {
//     return {
//       overall_trend: this.calculateTrendDirection(trendsResults),
//       peak_periods: this.findPeakPeriods(trendsResults),
//       related_topics: this.summarizeRelatedQueries(trendsResults),
//       growth_rate: this.calculateGrowthRate(trendsResults)
//     };
//   }

//   calculateTrendDirection(trendsResults) {
//     // Calculate overall trend direction using linear regression
//     return trendsResults.map(result => {
//       const values = result.interest_over_time.map(point => point.value);
//       const slope = this.calculateSlope(values);
//       return {
//         term: result.term,
//         direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
//         slope: slope
//       };
//     });
//   }

//   findPeakPeriods(trendsResults) {
//     // Find periods of peak interest
//     return trendsResults.map(result => {
//       const peaks = result.interest_over_time
//         .filter((point, i, arr) => {
//           if (i === 0 || i === arr.length - 1) return false;
//           return point.value > arr[i - 1].value && point.value > arr[i + 1].value;
//         })
//         .map(point => ({
//           date: point.date,
//           value: point.value
//         }));

//       return {
//         term: result.term,
//         peaks: peaks
//       };
//     });
//   }

//   calculateSlope(values) {
//     const n = values.length;
//     const x = Array.from({length: n}, (_, i) => i);
//     const sumX = x.reduce((a, b) => a + b, 0);
//     const sumY = values.reduce((a, b) => a + b, 0);
//     const sumXY = x.reduce((acc, curr, i) => acc + curr * values[i], 0);
//     const sumXX = x.reduce((acc, curr) => acc + curr * curr, 0);
    
//     return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
//   }

//   summarizeRelatedQueries(trendsResults) {
//     return trendsResults.map(result => ({
//       term: result.term,
//       rising_queries: result.related_queries.rising.slice(0, 5),
//       top_queries: result.related_queries.top.slice(0, 5)
//     }));
//   }

//   calculateGrowthRate(trendsResults) {
//     return trendsResults.map(result => {
//       const values = result.interest_over_time;
//       const firstValue = values[0].value;
//       const lastValue = values[values.length - 1].value;
//       const growthRate = ((lastValue - firstValue) / firstValue) * 100;

//       return {
//         term: result.term,
//         growth_rate: growthRate.toFixed(2) + '%',
//         initial_value: firstValue,
//         final_value: lastValue
//       };
//     });
//   }
// }

// // Example usage:
// const validator = new IdeaValidator(
//   'your-gemini-api-key',
//   'your-reddit-api-key',
//   'your-github-api-key',
//   'your-google-api-key'
// );

// async function validateUserIdea(idea) {
//   try {
//     const results = await validator.validateIdea(idea);
//     console.log('Validation Results:', results);
//     return results;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// }