import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';

export async function checkForCodeforcesStreak(username: string): Promise<boolean> {
    console.log(`Checking Codeforces streak for ${username}...`);
    try {
        const url = `https://codeforces.com/submissions/${username}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        const latestSubmissionTimeText = $('.datatable .status-frame-datatable tr:nth-child(2) td.status-small').first().text().trim();

        if (latestSubmissionTimeText) {
            const submissionDateStr = latestSubmissionTimeText.split(' ')[0];
            
            const monthMap: { [key: string]: number } = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
            const parts = submissionDateStr.split('/');
            
            if (parts.length === 3) {
                const year = parseInt(parts[2]);
                const month = monthMap[parts[0]];
                const day = parseInt(parts[1]);

                if (!isNaN(year) && month !== undefined && !isNaN(day)) {
                    const submissionDate = new Date(year, month, day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    submissionDate.setHours(0, 0, 0, 0);

                    if (submissionDate.getTime() === today.getTime()) {
                        console.log(`Codeforces: Submission found for ${username} today (${latestSubmissionTimeText}).`);
                        return true;
                    }
                }
            }
        }

        console.log(`Codeforces: No submission found for ${username} today. Check selectors if this is incorrect.`);
        return false;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(`Error checking Codeforces streak for ${username} (Axios Error):`, axiosError.message, axiosError.response?.status);
        } else if (error instanceof Error) {
            console.error(`Error checking Codeforces streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking Codeforces streak for ${username}:`, error);
        }
        return false;
    }
}
