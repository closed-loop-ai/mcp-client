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
    version: '1.0.0',
    description: 'Provides access to ClosedLoop AI product feedback data and insights.',
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
    description: 'Retrieve customer insights with optional filtering and pagination',
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

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
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

console.error('ClosedLoop MCP Server started');
