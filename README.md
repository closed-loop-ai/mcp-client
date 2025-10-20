# ClosedLoop MCP Server

A lightweight Model Context Protocol (MCP) server that provides AI clients with access to ClosedLoop customer feedback data and advanced search capabilities.

## Features

- **MCP Protocol Support**: Full MCP protocol implementation for AI client integration
- **API Key Authentication**: Secure team-based API key authentication
- **Team Isolation**: All data access is scoped to the team that owns the API key
- **Advanced Search**: Full-text search with relevance ranking across 8+ insight fields
- **Three Core Tools**:
  - `list_insights`: Get customer insights with date range and pagination
  - `get_insight_detail`: Get detailed information about specific insights
  - `search_insights`: **NEW** Advanced full-text search with filtering and relevance ranking

## Installation

```bash
npm install -g @closedloop-ai/mcp-client
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
      "args": ["@closedloop-ai/mcp-client"],
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

### search_insights ⭐ NEW
Advanced full-text search across customer insights with relevance ranking and comprehensive filtering.

**Key Features:**
- **Full-text search** across 8+ insight fields
- **Relevance ranking** - most relevant results appear first
- **Phrase search** and fuzzy matching
- **Field-specific search** - search specific fields or all fields
- **Advanced filtering** - category, severity, date range, source
- **Language agnostic** - works with any language

**Parameters:**
- `query` (required): Search query text
- `fields` (optional): Specific fields to search in
- `category` (optional): Filter by insight category
- `severity` (optional): Filter by severity level
- `date_from` (optional): Start date filter
- `date_to` (optional): End date filter
- `source` (optional): Filter by data source
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Searchable Fields:**
- `signal_title` - Insight title
- `content` - Raw feedback content
- `pain_point` - Customer pain points
- `workaround` - Customer workarounds
- `use_case` - Use case descriptions
- `feature_area` - Feature categorization
- `competitor_gap` - Competitive analysis
- `willingness_to_pay` - Payment willingness info

## Example Usage

Once configured, you can ask Claude questions like:

### Basic Insights
- "Show me all negative insights from last week"
- "What are the top customer insights this month?"

### Advanced Search
- "Search for mobile app performance issues"
- "Find insights about slow loading times in the Performance Issue category"
- "Search for pricing concerns in pain points and willingness to pay fields"
- "Find all high severity bugs from this month"
- "Search for integration problems with Typeform"

### Search Examples
- **Phrase search**: "Find insights about 'mobile app startup'"
- **Field-specific**: "Search pain points for 'frustrating experience'"
- **Category filter**: "Find all Feature Request insights about 'real-time collaboration'"
- **Severity filter**: "Search for critical issues with 'security'"
- **Date range**: "Find performance issues from January 2024"

## License

MIT