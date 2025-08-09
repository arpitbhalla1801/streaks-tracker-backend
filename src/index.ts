
import { Hono } from 'hono';
import type { Context } from 'hono';
import { checkForCodeforcesStreak } from './platforms/codeforces';
import { checkForLeetCodeStreak } from './platforms/leetcode';
import { checkForGitHubStreak } from './platforms/github';

const app = new Hono();

app.get('/api/streak', async (c: Context) => {
	const platform = c.req.query('platform');
	const username = c.req.query('username');
	if (!platform || !username) {
		return c.json({ success: false, error: 'Missing platform or username' }, 400);
	}
	let result = false;
	let description = '';
	try {
		switch (platform) {
			case 'codeforces':
				result = await checkForCodeforcesStreak(username);
				description = result ? 'User has an active Codeforces streak today.' : 'No Codeforces streak for today.';
				break;
			case 'leetcode':
				result = await checkForLeetCodeStreak(username);
				description = result ? 'User has an active LeetCode streak today.' : 'No LeetCode streak for today.';
				break;
			case 'github':
				result = await checkForGitHubStreak(username);
				description = result ? 'User has an active GitHub streak today.' : 'No GitHub streak for today.';
				break;
			default:
				return c.json({ success: false, error: 'Unsupported platform' }, 400);
		}
		return c.json({ success: true, platform, username, streak: result, description });
	} catch (error: any) {
		return c.json({ success: false, error: 'Internal server error', details: error?.message || error }, 500);
	}
});

app.post('/api/mail', async (c: Context) => {
	const { to, subject, body } = await c.req.json();
	if (!to || !subject || !body) {
		return c.json({ success: false, error: 'Missing to, subject, or body' }, 400);
	}
	// Simulate mail sending
	return c.json({ success: true, message: `Mail sent to ${to} with subject '${subject}'` });
});

app.post('/api/schedule', async (c: Context) => {
	const { task, time } = await c.req.json();
	if (!task || !time) {
		return c.json({ success: false, error: 'Missing task or time' }, 400);
	}
	// Simulate scheduling
	return c.json({ success: true, message: `Task '${task}' scheduled at ${time}` });
});

export default app;
