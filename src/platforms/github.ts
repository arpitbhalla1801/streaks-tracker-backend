interface GitHubContributionsResponse {
    data: {
        user: {
            contributionsCollection: {
                contributionCalendar: {
                    weeks: Array<{
                        contributionDays: Array<{
                            contributionCount: number;
                            date: string;
                        }>;
                    }>;
                };
            };
        };
    };
}

export async function checkForGitHubStreak(username: string): Promise<boolean> {
    console.log(`Checking GitHub streak for ${username}...`);
    try {
        // Using GitHub GraphQL API to get contributions data (same as contributions graph)
        const graphqlQuery = `
            query($username: String!) {
                user(login: $username) {
                    contributionsCollection {
                        contributionCalendar {
                            weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN || ''}`,
            },
            body: JSON.stringify({
                query: graphqlQuery,
                variables: { username }
            }),
        });

        if (!response.ok) {
            // Fallback to checking if user exists via REST API
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            if (userResponse.ok) {
            }
            return false;
        }

        const data: GitHubContributionsResponse = await response.json();

        if (!data.data?.user?.contributionsCollection?.contributionCalendar?.weeks) {
            return false;
        }

        // Get today's date in YYYY-MM-DD format (UTC)
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        

        // Look for today's contributions in the calendar data (UTC only)
        for (const week of data.data.user.contributionsCollection.contributionCalendar.weeks) {
            for (const day of week.contributionDays) {
                if (day.date === todayString && day.contributionCount > 0) {
                    return true;
                }
            }
        }

        return false;

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error checking GitHub streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking GitHub streak for ${username}:`, error);
        }
        return false;
    }
}
