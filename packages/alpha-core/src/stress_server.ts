import express from 'express';
import { buildSafeResponse } from './response_schema';

const app = express();
app.use(express.json());

const requestCache = new Map<string, number>();
const VALID_KEY = "test-key";

app.post('/api_gateway', (req: any, res: any) => {
    const clientKey = req.headers['x-api-key'] as string;
    if (!clientKey || clientKey !== VALID_KEY) {
        res.status(401).send(buildSafeResponse("Unauthorized: Invalid API Key.", null));
        return;
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
    const now = Date.now();
    const lastRequest = requestCache.get(clientIp) || 0;

    if (now - lastRequest < 1000) {
        res.status(429).send(buildSafeResponse("Rate limit exceeded. Please retry later.", null));
        return;
    }
    requestCache.set(clientIp, now);

    if (requestCache.size > 5000) requestCache.clear();

    const prompt = req.body.prompt;
    if (!prompt || typeof prompt !== 'string') {
        res.status(400).send(buildSafeResponse("Valid prompt string required.", null));
        return;
    }

    res.status(202).send(buildSafeResponse("Evento recibido.", {
        trackingId: "mock-id",
        status: 'PROCESSING',
        hash: "00000000000000000000000000000000",
        stability: 0
    }));
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Stress test server listening on port ${PORT}`);
});
