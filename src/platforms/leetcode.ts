const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

const RECENT_AC_SUBMISSIONS_QUERY = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
        }
    }
`;

interface Submission {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
}

interface LeetCodeGraphQLResponse {
    data: {
        recentAcSubmissionList: Submission[];
    };
}

export async function checkForLeetCodeStreak(username: string): Promise<boolean> {
    console.log(`Checking LeetCode streak for ${username}...`);
    try {
        const response = await fetch(LEETCODE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: RECENT_AC_SUBMISSIONS_QUERY,
                variables: {
                    username: username,
                    limit: 15,
                },
            }),
        });

        const data: LeetCodeGraphQLResponse = await response.json();
        const submissions = data.data.recentAcSubmissionList;

        if (!submissions || submissions.length === 0) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const submission of submissions) {
            const submissionDate = new Date(parseInt(submission.timestamp) * 1000);
            if (submissionDate >= today) {
                return true;
            }
        }

        return false;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error checking LeetCode streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking LeetCode streak for ${username}:`, error);
        }
        return false;
    }
}


