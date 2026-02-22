'use strict';

// Ported from frontend/src/utils/gdprMasking.ts
// Deterministic masking: same input always produces same fake output

const FAKE_FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Cameron', 'Drew',
  'Jamie', 'Reese', 'Skyler', 'Parker', 'Hayden', 'Emerson', 'Rowan', 'Finley', 'Sage', 'Blake',
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William',
  'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander',
  'Luna', 'Michael', 'Ella', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'David', 'Emily', 'Joseph',
  'Aria', 'Samuel', 'Scarlett', 'Sebastian', 'Grace', 'Jack', 'Chloe', 'Owen', 'Victoria', 'Gabriel',
  'Penelope', 'Carter', 'Layla', 'Jayden', 'Riley', 'John', 'Zoey', 'Luke', 'Nora', 'Dylan',
  'Lily', 'Grayson', 'Eleanor', 'Isaac', 'Hannah', 'Anthony', 'Lillian', 'Thomas', 'Addison', 'Charles',
  'Aubrey', 'Christopher', 'Ellie', 'Joshua', 'Stella', 'Andrew', 'Natalie', 'Lincoln', 'Zoe', 'Nathan',
  'Leah', 'Ryan', 'Hazel', 'Adrian', 'Violet', 'Eli', 'Aurora', 'Nolan', 'Savannah', 'Aaron'
];

const FAKE_LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott',
  'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
  'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Turner', 'Phillips', 'Evans', 'Parker', 'Edwards', 'Collins',
  'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey',
  'Bell', 'Gomez', 'Kelly', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson',
  'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers', 'Long',
  'Foster', 'Sanders', 'Ross', 'Morales', 'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins', 'Gutierrez',
  'Perry', 'Butler', 'Barnes', 'Fisher', 'Henderson', 'Coleman', 'Simmons', 'Patterson', 'Jordan', 'Reynolds'
];

const FAKE_COMPANIES = [
  'Stackflow', 'Builderly', 'Teamspace', 'Docuwise', 'Chartly', 'Formstack', 'Taskbird', 'Codebase',
  'Metricly', 'Trackify', 'Insightly', 'Launchpad', 'Scalebase', 'Cloudly', 'Deployify', 'Hostbase',
  'Meetly', 'Recordly', 'Boardify', 'Designly', 'Workstream', 'Projectly', 'Taskflow', 'Notewise',
  'Chatly', 'Supportly', 'Helpwise', 'Ticketly', 'Dealflow', 'Pipebase', 'Leadify', 'Closely',
  'Paybase', 'Finwise', 'Expensely', 'Bankify', 'Fundly', 'Equitybase', 'Payrolly', 'Peoplewise',
  'Monitorly', 'Alertify', 'Logwise', 'Dashbase', 'Oncallify', 'Incidently', 'Debugly', 'Tracewise',
  'Messagely', 'Mailwise', 'Campaignly', 'Sendbase', 'Engagely', 'Pushify', 'Automately', 'Flowbase',
  'Authly', 'Securify', 'Loginwise', 'Accessly', 'Identifybase', 'Shieldly', 'Protectify', 'Scanwise',
  'Repobase', 'Codewise', 'Branchly', 'Buildify', 'Testbase', 'Pipelinewise', 'Shiply', 'Deploybase',
  'Datawise', 'Warehously', 'Syncify', 'Streambase', 'Transformly', 'Qualitywise', 'Catalogly', 'Governbase',
  'Contentwise', 'Headlessly', 'Schemabase', 'Mediafly', 'Componentwise', 'Blockify', 'Modelbase', 'Fieldly',
  'Edgewise', 'Cachely', 'Speedbase', 'Sitewise', 'Infrabase', 'Computewise', 'Containerfly', 'Serverbase',
  'Feedbackly', 'Analytify', 'Sessionbase', 'Replaywise', 'Heatmaply', 'Researchify', 'Prototypewise', 'Insightbase'
];

function hashString(str) {
  let hash = 5381;
  const s = str.toLowerCase().trim();
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) + hash) + s.charCodeAt(i);
    hash = hash & hash; // keep 32-bit integer
  }
  return Math.abs(hash);
}

function maskName(value) {
  if (!value) return 'Anonymous User';
  const hash = hashString(value);
  return `${FAKE_FIRST_NAMES[hash % FAKE_FIRST_NAMES.length]} ${FAKE_LAST_NAMES[Math.floor(hash / FAKE_FIRST_NAMES.length) % FAKE_LAST_NAMES.length]}`;
}

function maskEmail(value) {
  if (!value) return 'user@example.com';
  const hash = hashString(value);
  const first = FAKE_FIRST_NAMES[hash % FAKE_FIRST_NAMES.length].toLowerCase();
  const last = FAKE_LAST_NAMES[Math.floor(hash / FAKE_FIRST_NAMES.length) % FAKE_LAST_NAMES.length].toLowerCase();
  return `${first}.${last}@example.com`;
}

function maskCompany(value) {
  if (!value) return 'Unknown Company';
  return FAKE_COMPANIES[hashString(value) % FAKE_COMPANIES.length];
}

function isEmail(value) {
  return typeof value === 'string' && value.includes('@');
}

// Mask a single customer string — handles both names and emails
function maskCustomer(value) {
  if (!value) return value;
  return isEmail(value) ? maskEmail(value) : maskName(value);
}

// Apply privacy masking to a tool response object
function applyPrivacyMask(data) {
  if (!data || typeof data !== 'object') return data;

  // Deep clone to avoid mutating the original
  const d = JSON.parse(JSON.stringify(data));

  // feedback / insight items (list_insights, search_insights, get_insight_detail)
  const maskInsightItem = (item) => {
    if (item.customer_name) item.customer_name = maskCustomer(item.customer_name);
    if (item.entities_integrations) {} // keep — not PII
    return item;
  };

  // get_planning_context response shape
  if (d.data) {
    const { patterns, insights } = d.data;

    if (Array.isArray(patterns)) {
      patterns.forEach(p => {
        if (Array.isArray(p.customers)) {
          p.customers = p.customers.map(maskCustomer);
        }
        if (Array.isArray(p.crm_deals)) {
          p.crm_deals = p.crm_deals.map(maskCompany);
        }
      });
    }

    if (Array.isArray(insights)) {
      insights.forEach(maskInsightItem);
    }

    // summary testing_candidates
    if (d.data.summary && Array.isArray(d.data.summary.testing_candidates)) {
      d.data.summary.testing_candidates = d.data.summary.testing_candidates.map(maskCustomer);
    }
  }

  // list_insights / search_insights: top-level items array
  if (Array.isArray(d.items)) {
    d.items.forEach(maskInsightItem);
  }

  // get_insight_detail: single item at root
  if (d.customer_name) maskInsightItem(d);

  return d;
}

const PRIVACY_MODE = process.env.CLOSEDLOOP_PRIVACY_MODE === 'true';

module.exports = { applyPrivacyMask, PRIVACY_MODE };
