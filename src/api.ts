import express, { Request, Response } from 'express';
import { checkForCodeforcesStreak } from './platforms/codeforces';
import { checkForLeetCodeStreak } from './platforms/leetcode';
import { checkForGitHubStreak } from './platforms/github';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Streak API
app.get('/api/streak', async (req: Request, res: Response) => {
    const { platform, username } = req.query;
    if (!platform || !username) {
        return res.status(400).json({ success: false, error: 'Missing platform or username' });
    }

    let result = false;
    let description = '';
    try {
        switch (platform) {
            case 'codeforces':
                result = await checkForCodeforcesStreak(username as string);
                description = result ? 'User has an active Codeforces streak today.' : 'No Codeforces streak for today.';
                break;
            case 'leetcode':
                result = await checkForLeetCodeStreak(username as string);
                description = result ? 'User has an active LeetCode streak today.' : 'No LeetCode streak for today.';
                break;
            case 'github':
                result = await checkForGitHubStreak(username as string);
                description = result ? 'User has an active GitHub streak today.' : 'No GitHub streak for today.';
                break;
            default:
                return res.status(400).json({ success: false, error: 'Unsupported platform' });
        }
        return res.json({ success: true, platform, username, streak: result, description });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error', details: error instanceof Error ? error.message : error });
    }
});

// Mail API
app.post('/api/mail', async (req: Request, res: Response) => {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
        return res.status(400).json({ success: false, error: 'Missing to, subject, or body' });
    }
    // Here you would integrate with a real mail service
    // For now, just simulate success
    return res.json({ success: true, message: `Mail sent to ${to} with subject '${subject}'` });
});

// Scheduler API
app.post('/api/schedule', async (req: Request, res: Response) => {
    const { task, time } = req.body;
    if (!task || !time) {
        return res.status(400).json({ success: false, error: 'Missing task or time' });
    }
    // Here you would integrate with a real scheduler
    // For now, just simulate success
    return res.json({ success: true, message: `Task '${task}' scheduled for ${time}` });
});

app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});
