\
import axios from 'axios';
import cheerio from 'cheerio';

export async function checkForGitHubStreak(username: string): Promise<boolean> {
    console.log(`Checking GitHub streak for ${username}...`);
    try {
        const url = `https://github.com/${username}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayDateString = `${year}-${month}-${day}`;

        let contributionsToday = 0;
        $('.ContributionCalendar-day').each((i, el) => {
            const dayDate = $(el).attr('data-date');
            if (dayDate === todayDateString) {
                const level = $(el).attr('data-level');
                const countAttr = $(el).attr('data-count');
                if (countAttr) {
                     contributionsToday = parseInt(countAttr);
                } else if (level) {
                    contributionsToday = parseInt(level) > 0 ? 1 : 0;
                }
                return false;
            }
        });
        
        if (contributionsToday > 0) {
            console.log(`GitHub: Contributions found for ${username} on ${todayDateString} (Count/Level: ${contributionsToday}).`);
            return true;
        }

        console.log(`GitHub: No contributions found for ${username} on ${todayDateString}. Check selectors if this is incorrect.`);
        return false;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error checking GitHub streak for ${username} (Axios Error):`, error.message, error.response?.status);
        } else if (error instanceof Error) {
            console.error(`Error checking GitHub streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking GitHub streak for ${username}:`, error);
        }
        return false;
    }
}

// Example usage (for testing purposes):
// (async () => {
//     const username = 'your-github-username'; // Replace with a valid GitHub username
//     const completed = await checkForGitHubStreak(username);
//     console.log(`GitHub streak completed today: ${completed}`);
// })();
