import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';

export async function checkForGFGStreak(username: string): Promise<boolean> {
    console.log(`Checking GeeksforGeeks streak for ${username}...`);
    try {
        const url = `https://auth.geeksforgeeks.org/user/${username}/practice`;
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const solvedTodayText = $('.solvedToday_head__E92dK + .solvedToday_body__32X6H').first().text();
        
        if (solvedTodayText) {
            const problemsSolvedToday = parseInt(solvedTodayText.trim());
            if (problemsSolvedToday > 0) {
                console.log(`GeeksforGeeks: ${username} has solved ${problemsSolvedToday} problem(s) today.`);
                return true;
            }
        }
        
        console.log(`GeeksforGeeks: No activity found for ${username} today.`);
        return false;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(`Error checking GeeksforGeeks streak for ${username} (Axios Error):`, axiosError.message, axiosError.response?.data);
        } else if (error instanceof Error) {
            console.error(`Error checking GeeksforGeeks streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking GeeksforGeeks streak for ${username}:`, error);
        }
        return false;
    }
}
