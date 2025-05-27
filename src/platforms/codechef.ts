import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';

export async function checkForCodeChefStreak(username: string): Promise<boolean> {
    console.log(`Checking CodeChef streak for ${username}...`);
    try {
        const url = `https://www.codechef.com/users/${username}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        const recentActivityDates = new Set<string>();
        $('.dataTable tbody tr').each((index, element) => {
            const dateText = $(element).find('td').eq(1).text().trim();
            if (dateText) {
                recentActivityDates.add(dateText);
            }
        });
        
        const today = new Date();
        const todayDateString = today.toISOString().slice(0, 10);

        for (const dateText of recentActivityDates) {
            if (dateText.includes('ago') || dateText.startsWith('Today')) { 
                 console.log(`CodeChef: Activity found for ${username} today (raw date: ${dateText}).`);
                 return true;
            }
            try {
                const submissionDate = new Date(dateText.split(' ')[0]);
                 if (!isNaN(submissionDate.getTime())) {
                    const submissionDateString = submissionDate.toISOString().slice(0, 10);
                    if (submissionDateString === todayDateString) {
                        console.log(`CodeChef: Activity found for ${username} on ${submissionDateString}.`);
                        return true;
                    }
                }
            } catch (e) {
            }
        }
        
        console.log(`CodeChef: No definitive activity found for ${username} today. Implement specific selectors.`);
        return false;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(`Error checking CodeChef streak for ${username} (Axios Error):`, axiosError.message, axiosError.response?.status);
        } else if (error instanceof Error) {
            console.error(`Error checking CodeChef streak for ${username}:`, error.message);
        } else {
            console.error(`An unknown error occurred while checking CodeChef streak for ${username}:`, error);
        }
        return false;
    }
}
