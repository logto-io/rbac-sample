import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exchangeAccessToken, makeRequest, } from "./lib.js";
const TOKEN_ENDPOINT = "https://wwgsyp.logto.app/oidc/token";
const CMS_API_BASE = "http://localhost:3000";
const CMS_CLIENT_ID = "i4y1dfprocho4wry453o2";
const CMS_API_RESOURCE = "https://api.csm.com";
const ALEX_PERSONAL_ACCESS_TOKEN = "pat_AWUEamV18AXz7QqdGvdQPE1pnfxvQhyv"; // Admin
const CHARLES_PERSONAL_ACCESS_TOKEN = "pat_DTQ0gHCPYdyR362rpDkDljnNpXcZBPqS"; // Author
// Create server instance
const server = new McpServer({
    name: "cms-mcp-server",
    version: "1.0.0",
});
let cachedAccessToken = null;
// Register tools
server.tool("get-available-article-count", "Get available articles count form the content management system", {}, async () => {
    // Exchange access token if it's not cached or expired
    if (!cachedAccessToken || cachedAccessToken.expired_at < Date.now()) {
        cachedAccessToken = await exchangeAccessToken({
            tokenEndpoint: TOKEN_ENDPOINT,
            clientId: CMS_CLIENT_ID,
            resource: CMS_API_RESOURCE,
            scope: "create:articles delete:articles list:articles publish:articles read:articles update:articles",
            personalAccessToken: CHARLES_PERSONAL_ACCESS_TOKEN,
        });
    }
    const articles = await makeRequest(`${CMS_API_BASE}/api/articles`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cachedAccessToken.access_token}`,
        },
    });
    if (!articles || articles.length === 0) {
        return {
            content: [{ type: "text", text: "No articles found" }],
        };
    }
    return {
        content: [
            {
                type: "text",
                text: `There are ${articles.length} articles available in the content management system`,
            },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("  MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
