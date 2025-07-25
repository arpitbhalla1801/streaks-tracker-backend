interface CodeforcesSubmission {
    id: number;
    contestId: number;
    creationTimeSeconds: number;
    relativeTimeSeconds: number;
    problem: {
        contestId: number;
        index: string;
        name: string;
    };
    author: {
        contestId: number;
        members: Array<{
            handle: string;
        }>;
    };
    programmingLanguage: string;
    verdict: string;
}

interface CodeforcesApiResponse {
    status: string;
    result: CodeforcesSubmission[];
}

export async function checkForCodeforcesStreak(username: string): Promise<boolean> {
    console.log(`Checking Codeforces streak for ${username}...`);
    try {
        // Using Codeforces API to get user submissions
        const apiUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=20`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const data: CodeforcesApiResponse = await response.json();

        if (data.status !== 'OK' || !data.result || data.result.length === 0) {
            console.log(`No recent submissions found for ${username} from Codeforces API.`);
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const submission of data.result) {
            const submissionDate = new Date(submission.creationTimeSeconds * 1000);
            submissionDate.setHours(0, 0, 0, 0);
            
            if (submissionDate.getTime() === today.getTime()) {
                console.log(`Codeforces submission found for ${username} today.`);
                return true;
            }
        }

        console.log(`No Codeforces submission found for ${username} today.`);
        return false;

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error checking Codeforces streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking Codeforces streak for ${username}:`, error);
        }
        return false;
    }
}
