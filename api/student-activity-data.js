import { put, list } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const FILENAME = 'student-activity-data.json';
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (!token) {
    return new Response('BLOB_READ_WRITE_TOKEN is missing. Please connect the Blob store to your Vercel project.', { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    if (request.method === 'GET') {
      // 1. List blobs to find our data file
      const { blobs } = await list({ token });
      const blob = blobs.find((b) => b.pathname === FILENAME);

      if (!blob) {
        // File doesn't exist yet, return null or empty structure
        return new Response(JSON.stringify(null), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      // 2. Fetch the content of the blob
      // cache: 'no-store' ensures we always get the latest version from the blob store URL, bypassing edge cache
      const data = await fetch(blob.url, { cache: 'no-store' }).then((res) => res.json());

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
      });
    }

    if (request.method === 'POST') {
      // 1. Get the new data from the request body
      const newData = await request.json();

      // 2. Overwrite the existing file in Blob Storage
      const { url } = await put(FILENAME, JSON.stringify(newData), {
        access: 'public',
        addRandomSuffix: false,
        token,
      });

      return new Response(JSON.stringify({ success: true, url }), {
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}