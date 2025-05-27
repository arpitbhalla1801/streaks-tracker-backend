import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';

export async function checkForLeetCodeStreak(username: string): Promise<boolean> {
    console.log(`Checking LeetCode streak for ${username}...`);
    try {
        const url = `https://leetcode.com/${username}/`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        console.log(`LeetCode: No definitive activity found for ${username} today. Implement specific selectors.`);
        return false;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(`Error checking LeetCode streak for ${username} (Axios Error):`, axiosError.message, axiosError.response?.status);
        } else if (error instanceof Error) {
            console.error(`Error checking LeetCode streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking LeetCode streak for ${username}:`, error);
        }
        return false;
    }
}
