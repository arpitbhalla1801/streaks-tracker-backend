import cron from 'node-cron';
import { sendReminderEmail } from '../email/notifier';
import { checkForLeetCodeStreak } from '../platforms/leetcode';
import { checkForCodeforcesStreak } from '../platforms/codeforces';
import { checkForCodeChefStreak } from '../platforms/codechef';
import { checkForGFGStreak } from '../platforms/gfg';
import { checkForGitHubStreak } from '../platforms/github';

cron.schedule('0 23 * * *', async () => {
    const username = process.env.LEETCODE_USERNAME;
    if (username) {
        const completed = await checkForLeetCodeStreak(username);
        if (!completed) {
            sendReminderEmail('LeetCode', username);
        }
    }
});

cron.schedule('0 23 * * *', async () => {
    const username = process.env.CODEFORCES_USERNAME;
    if (username) {
        const completed = await checkForCodeforcesStreak(username);
        if (!completed) {
            sendReminderEmail('Codeforces', username);
        }
    }
});

cron.schedule('0 23 * * *', async () => {
    const username = process.env.CODECHEF_USERNAME;
    if (username) {
        const completed = await checkForCodeChefStreak(username);
        if (!completed) {
            sendReminderEmail('CodeChef', username);
        }
    }
});

cron.schedule('0 23 * * *', async () => {
    const username = process.env.GFG_USERNAME;
    if (username) {
        const completed = await checkForGFGStreak(username);
        if (!completed) {
            sendReminderEmail('GeeksforGeeks', username);
        }
    }
});

cron.schedule('0 23 * * *', async () => {
    const username = process.env.GITHUB_USERNAME;
    if (username) {
        const completed = await checkForGitHubStreak(username);
        if (!completed) {
            sendReminderEmail('GitHub', username);
        }
    }
});

console.log('Streak tracker scheduler started for all platforms.');
