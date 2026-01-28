# ClosedLoop AI MCP Client

A lightweight Model Context Protocol (MCP) client that provides AI assistants with access to ClosedLoop AI customer feedback data and advanced search capabilities.

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

- `CLOSEDLOOP_API_KEY`: Your ClosedLoop AI API key (required)
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
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | string | No | Start date (YYYY-MM-DD) |
| `date_to` | string | No | End date (YYYY-MM-DD) |
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20, max: 100) |

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique insight identifier (UUID) |
| `signal_title` | string | Title/summary of the insight |
| `content` | string | Raw feedback content |
| `category` | string | Insight category (Bug, Feature Request, etc.) |
| `severity` | string | Severity level (critical, high, medium, low) |
| `status` | string | Processing status |
| `source_timestamp` | string | When feedback was received |
| `customer_name` | string | Customer who provided feedback |
| `reporter_name` | string | Person who reported the insight |
| `pain_point` | string | Identified customer pain point |
| `is_deal_blocker` | boolean | Whether this blocks deals |
| `relevance_score` | number | Business relevance score |
| `source_name` | string | Integration source name |
| `created_at` | string | When insight was created |

**Response Example:**
```json
{
  "insights": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "signal_title": "Mobile app crashes on startup",
      "content": "The app keeps crashing whenever I try to open it...",
      "category": "Bug",
      "severity": "high",
      "status": "processed",
      "source_timestamp": "2024-01-15T10:30:00Z",
      "customer_name": "Acme Corp",
      "reporter_name": "John Smith",
      "pain_point": "Cannot access mobile features",
      "is_deal_blocker": true,
      "relevance_score": 0.85,
      "source_name": "Intercom",
      "created_at": "2024-01-15T10:35:00Z"
    }
  ],
  "pagination": {
    "total_count": 142,
    "page": 1,
    "limit": 20,
    "total_pages": 8
  }
}
```

---

### get_insight_detail
Get detailed information about a specific insight item.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `insight_id` | string | Yes | UUID of the insight item |

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique insight identifier (UUID) |
| `signal_title` | string | Title/summary of the insight |
| `content` | string | Raw feedback content |
| `category` | string | Insight category |
| `severity` | string | Severity level |
| `status` | string | Processing status |
| `summary` | string | AI-generated summary |
| `outcome_categories` | array | Business impact categories |
| `customer_name` | string | Customer who provided feedback |
| `customer_email` | string | Customer email address |
| `reporter_name` | string | Person who reported the insight |
| `source_name` | string | Integration source name |
| `pain_point` | string | Identified customer pain point |
| `workaround` | string | Customer's current workaround |
| `use_case` | string | Use case description |
| `feature_area` | string | Related feature area |
| `competitor_gap` | string | Competitive analysis notes |
| `willingness_to_pay` | string | Payment willingness info |
| `source_timestamp` | string | When feedback was received |
| `created_at` | string | When insight was created |

**Response Example:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "signal_title": "Mobile app crashes on startup",
  "content": "The app keeps crashing whenever I try to open it on my iPhone...",
  "category": "Bug",
  "severity": "high",
  "status": "processed",
  "summary": "Critical mobile stability issue affecting iOS users on app launch",
  "outcome_categories": ["Product Quality", "User Experience", "Retention Risk"],
  "customer_name": "Acme Corp",
  "customer_email": "john@acme.com",
  "reporter_name": "John Smith",
  "source_name": "Intercom",
  "pain_point": "Cannot access mobile features, forced to use desktop",
  "workaround": "Using the web version on mobile browser",
  "use_case": "Field sales team needs mobile access for client meetings",
  "feature_area": "Mobile App",
  "competitor_gap": "Competitor X has stable mobile app",
  "willingness_to_pay": "Would pay extra for reliable mobile experience",
  "source_timestamp": "2024-01-15T10:30:00Z",
  "created_at": "2024-01-15T10:35:00Z"
}
```

---

### search_insights
Advanced full-text search across customer insights with relevance ranking and comprehensive filtering.

**Key Features:**
- **Full-text search** across 8+ insight fields
- **Relevance ranking** - most relevant results appear first
- **Phrase search** and fuzzy matching
- **Field-specific search** - search specific fields or all fields
- **Advanced filtering** - category, severity, date range, source
- **Language agnostic** - works with any language

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query text |
| `fields` | array | No | Specific fields to search in |
| `category` | string | No | Filter by insight category |
| `severity` | string | No | Filter by severity level |
| `date_from` | string | No | Start date filter (YYYY-MM-DD) |
| `date_to` | string | No | End date filter (YYYY-MM-DD) |
| `source` | string | No | Filter by data source |
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20, max: 100) |

**Searchable Fields:**
- `signal_title` - Insight title
- `content` - Raw feedback content
- `pain_point` - Customer pain points
- `workaround` - Customer workarounds
- `use_case` - Use case descriptions
- `feature_area` - Feature categorization
- `competitor_gap` - Competitive analysis
- `willingness_to_pay` - Payment willingness info

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique insight identifier (UUID) |
| `signal_title` | string | Title/summary of the insight |
| `content` | string | Raw feedback content |
| `category` | string | Insight category |
| `severity` | string | Severity level |
| `search_rank` | number | Search relevance score (higher = more relevant) |
| `summary` | string | AI-generated summary |
| `outcome_categories` | array | Business impact categories |
| `is_deal_blocker` | boolean | Whether this blocks deals |
| `relevance_score` | number | Business relevance score |
| `customer_name` | string | Customer who provided feedback |
| `source_name` | string | Integration source name |
| `source_timestamp` | string | When feedback was received |

**Response Example:**
```json
{
  "insights": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "signal_title": "Mobile app crashes on startup",
      "content": "The app keeps crashing whenever I try to open it...",
      "category": "Bug",
      "severity": "high",
      "search_rank": 0.92,
      "summary": "Critical mobile stability issue affecting iOS users",
      "outcome_categories": ["Product Quality", "User Experience"],
      "is_deal_blocker": true,
      "relevance_score": 0.85,
      "customer_name": "Acme Corp",
      "source_name": "Intercom",
      "source_timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total_count": 23,
    "page": 1,
    "limit": 20,
    "total_pages": 2
  },
  "query": "mobile crash"
}
```

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