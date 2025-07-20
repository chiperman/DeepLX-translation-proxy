# DeepLX-translation-proxy

This is a proxy server designed specifically to securely forward translation requests to the DeepLX API. It acts as an intermediary to protect your DeepLX API key, preventing its exposure in client-side code.

The server is configured with a strict CORS policy, allowing requests only from specified origins.

## How It Works

1.  The server exposes a single `POST /translate` endpoint.
2.  A client application sends a request to this endpoint with the text to be translated, the source language, and the target language.
3.  The proxy server retrieves the secret `DEEPLX_API_KEY` from its environment variables.
4.  It then forwards the translation request, including the secret key, to the `https://api.deeplx.org/translate` API.
5.  Finally, it returns the response from the DeepLX API directly to the client.

## Deploy Your Own

You can deploy your own instance to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchiperman%2Ftranslation-proxy&env=DEEPLX_API_KEY,ALLOWED_ORIGINS)

## API Endpoint

### `POST /translate`

Forwards a translation request to the DeepLX API.

**Request Body:**

```json
{
  "text": "Hello, world!",
  "source_lang": "EN",
  "target_lang": "ZH"
}
```

**Success Response:**

The JSON response from the DeepLX API.

**Error Response:**

If the request fails, the server-side API key is not configured, or input validation fails, it returns a 400 or 500 status code with a JSON body:

```json
{
  "error": "Error message",
  "details": "Optional additional details or validation errors"
}
```

## Configuration

To function correctly, the server requires the following environment variables. You can set these variables in your deployment environment, or by creating a `.env` file in the project root:

- `DEEPLX_API_KEY`: Your secret DeepLX API key.
  ```
  DEEPLX_API_KEY=your_secret_deeplx_api_key
  ```
- `ALLOWED_ORIGINS`: A comma-separated list of allowed CORS origins (e.g., `https://example.com,http://localhost:8080`).
  ```
  ALLOWED_ORIGINS=https://example.com,http://localhost:3000
  ```

## Running Locally

1.  Install dependencies:

    ```sh
    npm install
    ```

2.  Run the server (make sure to replace `your_api_key` and `your_allowed_origins` with your actual values):

    ```sh
    DEEPLX_API_KEY=your_api_key ALLOWED_ORIGINS=your_allowed_origins npm start
    ```

    The server will start on port 3000.

## Deployment

This project is configured for easy deployment as a serverless function on [Vercel](https://vercel.com/). The `vercel.json` file handles the necessary build and routing configurations.
