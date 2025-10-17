# ClosedLoop MCP Server

A lightweight Model Context Protocol (MCP) server that provides AI clients with access to ClosedLoop customer feedback data.

## Features

- **MCP Protocol Support**: Full MCP protocol implementation for AI client integration
- **API Key Authentication**: Secure team-based API key authentication
- **Team Isolation**: All data access is scoped to the team that owns the API key
- **Two Core Tools**:
  - `list_insights`: Get customer insights with date range and pagination
  - `get_insight_detail`: Get detailed information about specific insights

## Installation

```bash
npm install -g @jirikobelka/server-closedloop
```

## Configuration

Set the following environment variables:

- `CLOSEDLOOP_API_KEY`: Your ClosedLoop API key (required)
- `CLOSEDLOOP_SERVER_URL`: Server URL (default: https://mcp.closedloop.sh)

## Usage with Claude

Add this configuration to your Claude Desktop app:

```json
{
  "mcpServers": {
    "closedloop": {
      "command": "npx",
      "args": ["@jirikobelka/server-closedloop"],
      "env": {
        "CLOSEDLOOP_API_KEY": "your-api-key-here",
        "CLOSEDLOOP_SERVER_URL": "https://mcp.closedloop.sh"
      }
    }
  }
}
```

## MCP Tools

### list_insights
Retrieve customer insights with optional filtering and pagination.

**Parameters:**
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)  
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

### get_insight_detail
Get detailed information about a specific insight item.

**Parameters:**
- `insight_id` (required): UUID of the insight item

## Example Usage

Once configured, you can ask Claude questions like:

- "Show me all negative insights from last week"
- "What are the top customer insights this month?"
- "Find insights about the dashboard being confusing"
- "Give me insights on user onboarding issues"

## License

MIT