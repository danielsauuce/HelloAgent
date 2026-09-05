

type Provider = "gemini" | "openai" | "groq" ;

type HelloOutput = {
    ok: true;
    provider: Provider;
    model: string;
    message: string;
};


type GeminiGenereateContent = {
    candidate?: Array<{content?: {parts?: Array<{text?: string;}>;}}>;
}

async function helloGemini(): Promise<HelloOutput> {

    const apiKey = process.env.GEMINI_API_KEY;

    if(!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    const model = "gemini-3.5-flash-lite";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: {
                parts: [
                    {
                        text: "Hello from Gemini!"
                    }
                ]
            }
        }),
    });

    if (!response.ok) {
        throw new Error(`Gemini ${response.status}: ${ await response.text()}`);
    }

    const json = await response.json() as GeminiGenereateContent;
    const text = json.candidate?.[0]?.content?.parts?.[0]?.text || "No text returned";

    return {
        ok: true,
        provider: "gemini",
        model,
        message: text
    };
  
}
