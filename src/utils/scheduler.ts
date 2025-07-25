import cron from 'node-cron';
import { sendReminderEmail } from '../email/notifier';
import { checkForLeetCodeStreak } from '../platforms/leetcode';
import { checkForCodeforcesStreak } from '../platforms/codeforces';
import { checkForCodeChefStreak } from '../platforms/codechef';
import { checkForGFGStreak } from '../platforms/gfg';
import { checkForGitHubStreak } from '../platforms/github';

cron.schedule('0 23 * * *', async () => {
    console.log('Running daily streak checks...');

    const platforms = [
        { name: 'LeetCode', username: process.env.LEETCODE_USERNAME, checker: checkForLeetCodeStreak },
        { name: 'Codeforces', username: process.env.CODEFORCES_USERNAME, checker: checkForCodeforcesStreak },
        { name: 'CodeChef', username: process.env.CODECHEF_USERNAME, checker: checkForCodeChefStreak },
        { name: 'GeeksforGeeks', username: process.env.GFG_USERNAME, checker: checkForGFGStreak },
        { name: 'GitHub', username: process.env.GITHUB_USERNAME, checker: checkForGitHubStreak },
    ];

    for (const platform of platforms) {
        if (platform.username) {
            try {
                const completed = await platform.checker(platform.username);
                if (!completed) {
                    sendReminderEmail(platform.name, platform.username);
                }
            } catch (error) {
                console.error(`Error checking streak for ${platform.name}:`, error);
            }
        }
    }
});

console.log('Streak tracker scheduler started for all platforms.');
