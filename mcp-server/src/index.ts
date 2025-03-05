import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { AccessToken, exchangeAccessToken, makeRequest } from "./lib.js";
import {
  CMS_API_BASE,
  CMS_API_RESOURCE,
  CMS_CLIENT_ID,
  PERSONAL_ACCESS_TOKEN,
  TOKEN_ENDPOINT,
} from "./config.js";

// Create server instance
const server = new McpServer({
  name: "cms-mcp-server",
  version: "1.0.0",
});

type Article = {
  id: string;
  title: string;
  isPublished: boolean;
  ownerId: string;
  createdAt: string;
};

let cachedAccessToken: AccessToken | null = null;

// Register tools
server.tool(
  "get-available-article-count",
  "Get available articles count form the content management system",
  {},
  async () => {
    // Exchange access token if it's not cached or going to expire in the next 5 minutes
    if (
      !cachedAccessToken ||
      cachedAccessToken.expired_at < Date.now() - 5 * 60 * 1000
    ) {
      cachedAccessToken = await exchangeAccessToken({
        tokenEndpoint: TOKEN_ENDPOINT,
        clientId: CMS_CLIENT_ID,
        resource: CMS_API_RESOURCE,
        scope:
          "create:articles delete:articles list:articles publish:articles read:articles update:articles",
        personalAccessToken: PERSONAL_ACCESS_TOKEN,
      });
    }

    const articles = await makeRequest<Article[]>(
      `${CMS_API_BASE}/api/articles`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cachedAccessToken.access_token}`,
        },
      }
    );

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
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("  MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
