import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const FILENAME = 'student-activity-data.json';
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check for API token
  if (!token) {
    res.status(500).send('BLOB_READ_WRITE_TOKEN is missing. Please connect the Blob store to your Vercel project.');
    return;
  }

  try {
    if (req.method === 'GET') {
      // 1. List blobs to find our data file
      const { blobs } = await list({ token });
      const blob = blobs.find((b) => b.pathname === FILENAME);

      if (!blob) {
        // File doesn't exist yet, return null
        res.status(200).json(null);
        return;
      }

      // 2. Fetch the content of the blob
      const response = await fetch(blob.url, { cache: 'no-store' });
      const data = await response.json();

      res.status(200).json(data);
      return;
    }

    if (req.method === 'POST') {
      // 1. Get the new data from the request body (Vercel parses JSON automatically)
      const newData = req.body;

      // 2. Overwrite the existing file in Blob Storage
      const { url } = await put(FILENAME, JSON.stringify(newData), {
        access: 'public',
        addRandomSuffix: false,
        token,
      });

      res.status(200).json({ success: true, url });
      return;
    }

    res.status(405).send('Method not allowed');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}