# Gemini API Video & Image Quickstart

This repository is a quickstart that demonstrates how to build a simple UI to generate videos with **[Veo 3](https://ai.google.dev/gemini-api/docs/video)** and generate/edit images with **[Gemini 2.5 Flash Image](https://ai.google.dev/gemini-api/docs/image-generation)**, all powered by the Gemini API.

![Example](./public/example.png)

> [!NOTE]  
> If you want a full studio, consider [Google's Flow](https://labs.google/fx/tools/flow) (a professional environment for Veo/Imagen). Use this repo as a lightweight quickstart to learn how to build your own UI that generates media with the Gemini API.

(This is not an official Google product.)

## Features

-   Generate videos from text prompts using the Veo 3 model.
-   Generate and edit images using text prompts and existing images with Gemini 2.5 Flash Image.
-   Use a generated image as the starting point for a video generation.
-   Play and download generated videos.
-   Cut videos directly in the browser to a specific time range.

## Getting Started: Development and Local Testing

Follow these steps to get the application running locally.

**1. Prerequisites:**

-   Node.js and npm (or yarn/pnpm)
-   An API Key for the Gemini API.

**2. Configure API Access (Choose one):**

### Option A: Gemini API (Default)

The application uses the Gemini API by default.

-   **`GEMINI_API_KEY`**: The application requires a [GEMINI API key](https://aistudio.google.com/app/apikey). Create a `.env` file in the project root and add your API key:
    ```
    GEMINI_API_KEY="YOUR_API_KEY"
    ```

> [!WARNING]  
> The models used in this quickstart are part of the Gemini API Paid tier. You will need to enable billing to use them.

### Option B: Vertex AI

For enterprise use cases, you can run this quickstart using a Vertex AI backend. This requires a Google Cloud project with the Vertex AI API enabled.

-   Set the following environment variables in your system or in the `.env` file:
    ```
    # Required: Tells the SDK to use the Vertex AI backend
    GOOGLE_GENAI_USE_VERTEXAI=true

    # Required: Your Google Cloud project ID
    GOOGLE_CLOUD_PROJECT="your-gcp-project-id"

    # Optional: The GCP region for the Vertex AI endpoint. Defaults to "us-central1".
    GOOGLE_CLOUD_LOCATION="us-central1"
    ```
-   Ensure you have authenticated with Google Cloud locally. The easiest way is to use the gcloud CLI:
    ```bash
    gcloud auth application-default login
    ```

**3. Install Dependencies:**

```bash
npm install
```

**3. Run Development Server:**

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see the application.

## Project Structure

The project is a standard Next.js application with the following key directories:

-   `app/`: Contains the main application logic, including the user interface and API routes.
    -   `api/`: API routes for generating videos and images, and checking operation status.
-   `components/`: Reusable React components used throughout the application.
-   `lib/`: Utility functions and schema definitions.
-   `public/`: Static assets.

## Official Docs and Resources

-   Gemini API docs: `https://ai.google.dev/gemini-api/docs`
-   Veo 3 Guide: `https://ai.google.dev/gemini-api/docs/video?example=dialogue`
-   Imagen 4 Guide: `https://ai.google.dev/gemini-api/docs/imagen`

## How it Works

The application uses the following API routes to interact with the Google models:

-   `app/api/veo/generate/route.ts`: Handles video generation requests with the Veo 3 model.
-   `app/api/veo/operation/route.ts`: Checks the status of a video generation operation.
-   `app/api/veo/download/route.ts`: Downloads the generated video.
-   `app/api/gemini/generate/route.ts`: Handles image generation and editing requests with the Gemini 2.5 Flash Image model.

## Technologies Used

-   [Next.js](https://nextjs.org/) - React framework for building the user interface.
-   [React](https://reactjs.org/) - JavaScript library for building user interfaces.
-   [Tailwind CSS](https://tailwindcss.com/) - For styling.
-   [Gemini API](https://ai.google.dev/gemini-api/docs) - Used for both video (Veo 3) and image (Gemini 2.5 Flash Image) generation.
-   [@google/genai](https://github.com/googleapis/js-genai) - The Google Gen AI SDK for TypeScript/JavaScript.

## Questions and feature requests

-   **Want a feature?** Please open an issue describing the use case and proposed behavior.

## License

This project is licensed under the Apache License 2.0.
