const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-your-api-key-here'; // 请替换为你的 DashScope API Key，或设置环境变量 DASHSCOPE_API_KEY

// MIME types for static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    console.log(`[Request] ${req.method} ${pathname}`);

    // --- 3. Image Proxy (Fix for html2canvas CORS) ---
    if (pathname === '/proxy-image') {
        const queryUrl = parsedUrl.query.url;
        if (!queryUrl) {
            res.writeHead(400);
            res.end('Missing url parameter');
            return;
        }

        const targetUrl = new URL(queryUrl);
        const proxyReq = (targetUrl.protocol === 'https:' ? https : http).get(queryUrl, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
                ...proxyRes.headers,
                'Access-Control-Allow-Origin': '*' // Explicitly allow
            });
            proxyRes.pipe(res, { end: true });
        }).on('error', (e) => {
            res.writeHead(500);
            res.end(e.message);
        });
        return;
    }

    // --- 1. API Endpoints (Backend Proxy) ---
    if (pathname.startsWith('/api/')) {
        handleApiRequest(req, res, pathname);
        return;
    }

    // --- 2. Static File Serving ---
    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Prevent directory traversal
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            const ext = path.extname(filePath);
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);
            res.writeHead(200);
            res.end(data);
        }
    });
});

// Helper: Handle API Calls to Alibaba Cloud
function handleApiRequest(req, res, pathname) {
    // Map local /api/ endpoints to DashScope endpoints
    let remoteHostname = 'dashscope.aliyuncs.com';
    let remotePath = '';

    if (pathname === '/api/generate-text') {
        remotePath = '/api/v1/services/aigc/text-generation/generation';
    } else if (pathname === '/api/generate-image') {
        remotePath = '/api/v1/services/aigc/text2image/image-synthesis';
    } else if (pathname.startsWith('/api/task/')) {
        const taskId = pathname.split('/')[3]; // /api/task/{taskId}
        remotePath = `/api/v1/tasks/${taskId}`;
    } else {
        res.writeHead(404);
        res.end('API Endpoing Not Found');
        return;
    }

    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };

    // Only add Async header for Image Generation Submission
    if (pathname === '/api/generate-image') {
        headers['X-DashScope-Async'] = 'enable';
    }

    const options = {
        hostname: remoteHostname,
        port: 443,
        path: remotePath,
        method: req.method,
        headers: headers
    };

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (e) => {
        console.error(`[API Error] ${e.message}`);
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
    });

    req.pipe(proxyReq, { end: true });
}

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`✅ App Server is running!`);
    console.log(`👉 Access URL: http://localhost:${PORT}`);
    console.log(`   - Static files served from current directory`);
    console.log(`   - API calls secured and proxied to Alibaba Cloud`);
    console.log(`==================================================\n`);
});
