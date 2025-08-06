import 'dotenv/config';
import cron from 'node-cron';
import { sendReminderEmail } from '../email/notifier';
import { checkForLeetCodeStreak } from '../platforms/leetcode';
import { checkForCodeforcesStreak } from '../platforms/codeforces';
import { checkForGitHubStreak } from '../platforms/github';

cron.schedule('* * * * *', async () => {
    console.log('Running daily streak checks...');

    const platforms = [
        { name: 'LeetCode', username: process.env.LEETCODE_USERNAME, checker: checkForLeetCodeStreak },
        { name: 'Codeforces', username: process.env.CODEFORCES_USERNAME, checker: checkForCodeforcesStreak },
        { name: 'GitHub', username: process.env.GITHUB_USERNAME, checker: checkForGitHubStreak },
    ];

    for (const platform of platforms) {
        if (platform.username) {
            // console.log(`Checking streak for ${platform.name} (${platform.username})...`);
            try {
                const completed = await platform.checker(platform.username);
                console.log(`Streak check result for ${platform.name}: ${completed}`);
                if (!completed) {
                    sendReminderEmail(platform.name, platform.username);
                }
            } catch (error) {
                console.error(`Error checking streak for ${platform.name}:`, error);
            }
        } else {
            console.log(`No username set for ${platform.name}, skipping.`);
        }
    }
});

console.log('Streak tracker scheduler started for all platforms.');
