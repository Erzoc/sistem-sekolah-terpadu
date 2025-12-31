import { config } from 'dotenv';
import { resolve } from 'path';

// ✅ LOAD .env.local MANUALLY
config({ path: resolve(process.cwd(), '.env.local') });

async function testOpenRouter() {
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('=== OpenRouter API Test ===');
    console.log('Working Dir:', process.cwd());
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 25)}...` : 'NOT SET');

    if (!apiKey) {
        console.error('❌ OPENAI_API_KEY not found');
        process.exit(1);
    }

    console.log('\n🔄 Testing OpenRouter API...\n');

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Say "test"' }],
                max_tokens: 5,
            }),
        });

        console.log('Status:', response.status, response.statusText);

        const data = await response.json();

        if (response.ok) {
            console.log('\n✅ SUCCESS!');
            console.log('Response:', data.choices?.[0]?.message?.content);
        } else {
            console.log('\n❌ API Error:');
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
    }
}

testOpenRouter();
