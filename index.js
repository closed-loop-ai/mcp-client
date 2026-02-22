#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

// Get configuration from environment
const CLOSEDLOOP_API_KEY = process.env.CLOSEDLOOP_API_KEY;
const CLOSEDLOOP_SERVER_URL = process.env.CLOSEDLOOP_SERVER_URL || 'https://mcp.closedloop.sh';

if (!CLOSEDLOOP_API_KEY) {
  console.error('Error: CLOSEDLOOP_API_KEY environment variable is required');
  process.exit(1);
}

// Create MCP server
const server = new Server(
  {
    name: 'closedloop-mcp-server',
    version: '1.1.2',
    description: 'Provides access to ClosedLoop AI product feedback data and insights with advanced search capabilities.',
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Define available tools
const tools = [
  {
    name: 'list_insights',
    description: 'Retrieve product insights with optional filtering, sorting, and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Start date for insights (YYYY-MM-DD)',
          format: 'date'
        },
        date_to: {
          type: 'string',
          description: 'End date for insights (YYYY-MM-DD)',
          format: 'date'
        },
        severity: {
          type: 'string',
          enum: ['critical', 'high', 'medium', 'low', 'all'],
          description: 'Filter by severity level (default: all)'
        },
        status: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Filter by insight status (default: all)'
        },
        source_id: {
          type: 'string',
          description: 'Filter by integration source UUID'
        },
        tag: {
          type: 'string',
          description: 'Filter by tag (letters, numbers, underscores, hyphens only)'
        },
        sort_by: {
          type: 'string',
          enum: ['timestamp', 'severity', 'status'],
          description: 'Field to sort by (default: timestamp)'
        },
        sort_order: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction (default: desc)'
        },
        page: {
          type: 'integer',
          description: 'Page number (default: 1)',
          minimum: 1
        },
        limit: {
          type: 'integer',
          description: 'Insight items per page (default: 20, max: 100)',
          minimum: 1,
          maximum: 100
        }
      }
    }
  },
  {
    name: 'get_insight_detail',
    description: 'Get detailed information about a specific insight item',
    inputSchema: {
      type: 'object',
      properties: {
        insight_id: {
          type: 'string',
          description: 'UUID of the insight item'
        }
      },
      required: ['insight_id']
    }
  },
  {
    name: 'search_insights',
    description: 'Search insights using full-text search across multiple fields',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query text (works in any language)'
        },
        fields: {
          type: 'array',
          items: { 
            type: 'string',
            enum: ['signal_title', 'content', 'pain_point', 'workaround', 'use_case', 'feature_area', 'competitor_gap', 'willingness_to_pay']
          },
          description: 'Specific fields to search in (optional - searches all if not specified)'
        },
        date_from: {
          type: 'string',
          format: 'date',
          description: 'Start date for insights (YYYY-MM-DD)'
        },
        date_to: {
          type: 'string',
          format: 'date',
          description: 'End date for insights (YYYY-MM-DD)'
        },
        severity: {
          type: 'string',
          enum: ['critical', 'high', 'medium', 'low'],
          description: 'Filter by severity level'
        },
        category: {
          type: 'string',
          enum: [
            'Bug', 'Performance Issue', 'Security Issue', 'Feature Request', 
            'Improvement', 'UX/UI Issue', 'Documentation', 'Integration Issue', 
            'Missing Functionality'
          ],
          description: 'Filter by category'
        },
        source: {
          type: 'string',
          description: 'Filter by integration source'
        },
        page: {
          type: 'integer',
          minimum: 1,
          maximum: 1000,
          default: 1,
          description: 'Page number for pagination'
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 20,
          description: 'Number of insight items per page'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_planning_context',
    description: 'Get customer evidence for a feature or task before planning/implementing. Returns semantically matched patterns ranked by business impact, deal blockers, churn risks, affected CRM deals, and individual signals with full context. Call this before writing any implementation plan.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Task or feature description to find relevant customer evidence for'
        },
        limit_patterns: {
          type: 'integer',
          minimum: 1,
          maximum: 20,
          default: 5,
          description: 'Max patterns to return (default 5)'
        },
        limit_insights: {
          type: 'integer',
          minimum: 1,
          maximum: 20,
          default: 10,
          description: 'Max individual insights to return (default 10)'
        }
      },
      required: ['query']
    }
  }
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const headers = {
      'Authorization': `Bearer ${CLOSEDLOOP_API_KEY}`,
      'Content-Type': 'application/json'
    };

    let response;

    switch (name) {
      case 'list_insights':
        response = await axios.get(`${CLOSEDLOOP_SERVER_URL}/feedbacks`, {
          headers,
          params: args
        });
        break;

      case 'get_insight_detail':
        if (!args.insight_id) {
          throw new Error('insight_id is required');
        }
        response = await axios.get(`${CLOSEDLOOP_SERVER_URL}/feedbacks/${args.insight_id}`, {
          headers
        });
        break;

      case 'search_insights':
        if (!args.query) {
          throw new Error('query is required');
        }
        // Use MCP protocol for search_insights
        response = await axios.post(CLOSEDLOOP_SERVER_URL, {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'search_insights',
            arguments: args
          }
        }, {
          headers
        });
        break;

      case 'get_planning_context':
        if (!args.query) {
          throw new Error('query is required');
        }
        response = await axios.get(`${CLOSEDLOOP_SERVER_URL}/planning-context`, {
          headers,
          params: args
        });
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    // Handle MCP protocol response for search_insights
    let responseData = response.data;
    if (name === 'search_insights' && responseData.result) {
      responseData = responseData.result;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(responseData, null, 2)
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);

console.error('ClosedLoop AI MCP Client started');
