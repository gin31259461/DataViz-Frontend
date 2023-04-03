// import dynamic from 'next/dynamic';
import next from 'next';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const apiPaths = {
	'/api': {
		target: 'http://localhost:3080',
		pathRewrite: {
			'^/api': '/api',
		},
		changeOrigin: true,
	},
};

const isDevelopment = process.env.NODE_ENV !== 'production';

app
	.prepare()
	.then(() => {
		const server = express();

		if (isDevelopment) {
			server.use('/api', createProxyMiddleware(apiPaths['/api']));
		}

		server.all('*', (req, res) => {
			return handle(req, res);
		});

		server.listen(port, () => {
			console.log(`> Frontend Ready on http://localhost:${port}`);
		});
	})
	.catch((err) => {
		console.log('Error:::::', err);
	});
