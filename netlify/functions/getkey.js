export async function handler() {
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ key: process.env.ANTHROPIC_API_KEY }),
  };
}