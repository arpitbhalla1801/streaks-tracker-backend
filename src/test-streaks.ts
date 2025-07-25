import * as dotenv from 'dotenv';
import { checkForLeetCodeStreak } from './platforms/leetcode';
import { checkForCodeforcesStreak } from './platforms/codeforces';
import { checkForGitHubStreak } from './platforms/github';
import { sendReminderEmail } from './email/notifier';

dotenv.config();

async function testLeetCode() {
    const username = process.env.LEETCODE_USERNAME;
    if (!username) {
        console.error('LEETCODE_USERNAME not set in .env file.');
        return;
    }

    console.log(`Running manual check for LeetCode user: ${username}`);
    try {
        const completed = await checkForLeetCodeStreak(username);

        if (completed) {
            console.log('Streak maintained for LeetCode.');
        } else {
            console.log('Streak not maintained for LeetCode. Sending reminder.');
            // await sendReminderEmail('LeetCode', username);
        }
    } catch (error) {
        console.error('An error occurred during the manual check:', error);
    }
}

async function testCodeforces() {
    const username = process.env.CODEFORCES_USERNAME;
    if (!username) {
        console.error('CODEFORCES_USERNAME not set in .env file.');
        return;
    }

    console.log(`Running manual check for Codeforces user: ${username}`);
    try {
        const completed = await checkForCodeforcesStreak(username);

        if (completed) {
            console.log('Streak maintained for Codeforces.');
        } else {
            console.log('Streak not maintained for Codeforces. Sending reminder.');
            // await sendReminderEmail('Codeforces', username);
        }
    } catch (error) {
        console.error('An error occurred during the manual check:', error);
    }
}

async function testGitHub() {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
        console.error('GITHUB_USERNAME not set in .env file.');
        return;
    }

    console.log(`Running manual check for GitHub user: ${username}`);
    try {
        const completed = await checkForGitHubStreak(username);

        if (completed) {
            console.log('Streak maintained for GitHub.');
        } else {
            console.log('Streak not maintained for GitHub. Sending reminder.');
            // await sendReminderEmail('GitHub', username);
        }
    } catch (error) {
        console.error('An error occurred during the manual check:', error);
    }
}

testLeetCode();
testCodeforces();
testGitHub();
