import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// TELCHAR AI - AI READINESS ASSESSMENT v2
// ============================================================

const BRAND = {
  navy: "#1B2A3D",
  navyDeep: "#131F2E",
  navyLight: "#243447",
  blue: "#2D8BF0",
  blueBright: "#3B9AFF",
  blueGlow: "rgba(45, 139, 240, 0.15)",
  white: "#FFFFFF",
  gray100: "#F4F6F8",
  gray200: "#E2E6EB",
  gray300: "#C5CCD6",
  gray400: "#8895A5",
  gray500: "#5A6878",
  red: "#E84855",
  orange: "#F5A623",
  yellow: "#F5D523",
  green: "#34C759",
  gold: "#D9B95E",
};
const ANVIL_URL = "data:image/png;base64,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";

const INDUSTRIES = [
  "Professional Services",
  "Healthcare",
  "Construction / Trades",
  "Retail / E-commerce",
  "Food & Beverage",
  "Real Estate",
  "Manufacturing",
  "Logistics / Transportation",
  "Financial Services",
  "Insurance",
  "Legal",
  "Marketing / Creative Agency",
  "Other",
];

const QUESTIONS = [
  {
    id: "company_name",
    section: 1,
    sectionTitle: "About Your Business",
    label: "What is your company name?",
    type: "text",
    required: true,
    placeholder: "Enter your company name",
  },
  {
    id: "industry",
    section: 1,
    label: "What industry are you in?",
    type: "select",
    required: true,
    options: INDUSTRIES,
    hasOther: true,
    autoAdvance: true,
  },
  {
    id: "years_in_business",
    section: 1,
    label: "How long have you been in business?",
    type: "select",
    required: true,
    options: ["Less than 1 year", "1 to 3 years", "3 to 10 years", "10+ years"],
    autoAdvance: true,
  },
  {
    id: "employee_count",
    section: 1,
    label: "How many full time employees do you have?",
    type: "select",
    required: true,
    options: ["Just me", "2 to 10", "11 to 50", "51 to 200", "201+"],
    autoAdvance: true,
  },
  {
    id: "annual_revenue",
    section: 1,
    label: "What is your approximate annual revenue?",
    type: "select",
    required: true,
    options: ["Under $500K", "$500K to $1M", "$1M to $5M", "$5M to $20M", "$20M+", "Prefer not to say"],
    autoAdvance: true,
  },
  {
    id: "contact_name",
    section: 1,
    label: "What is your name?",
    type: "text",
    required: true,
    placeholder: "Your full name",
  },
  {
    id: "contact_email",
    section: 1,
    label: "What is your email?",
    type: "email",
    required: true,
    placeholder: "you@company.com",
  },
  {
    id: "customer_intake",
    section: 2,
    sectionTitle: "How You Operate Today",
    label: "How do you currently manage customer inquiries or intake?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "operations", scores: { 0: 1, 1: 4, 2: 2, 3: 1 } },
    options: [
      "Phone/email manually",
      "A CRM or intake system",
      "A mix of both",
      "We don't have a defined process",
    ],
  },
  {
    id: "customer_acquisition",
    section: 2,
    label: "How do your customers typically find you?",
    type: "multiselect",
    required: true,
    scoring: { category: "sales" },
    options: [
      "Word of mouth",
      "Social media",
      "Paid ads",
      "Our website",
      "Referral partners",
      "We're not sure",
    ],
  },
  {
    id: "scheduling",
    section: 2,
    label: "How do you handle scheduling, appointments, or job coordination?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "operations", scores: { 0: 1, 1: 4, 2: 2, 3: 1 } },
    options: [
      "Manually via phone/email/text",
      "A scheduling tool or software",
      "A mix",
      "We struggle with this",
    ],
  },
  {
    id: "admin_hours",
    section: 2,
    label: "How much time per week does your team spend on repetitive admin tasks like data entry, invoicing, follow-ups, or reporting?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "data", scores: { 0: 4, 1: 3, 2: 2, 3: 1, 4: 1 } },
    options: ["Less than 5 hours", "5 to 15 hours", "15 to 30 hours", "30+ hours", "No idea"],
  },
  {
    id: "performance_tracking",
    section: 2,
    label: "How do you currently track business performance (revenue, costs, customer satisfaction)?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "data", scores: { 0: 2, 1: 3, 2: 4, 3: 1 } },
    options: [
      "Spreadsheets",
      "Accounting software like QuickBooks",
      "A dashboard or BI tool",
      "We don't track this consistently",
    ],
  },
  {
    id: "sales_process",
    section: 2,
    label: "What does your sales process look like?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "sales", scores: { 0: 1, 1: 2, 2: 3, 3: 4 } },
    options: [
      "We respond when people reach out",
      "We have a basic follow-up process",
      "We have a structured pipeline with stages",
      "We use a CRM to manage everything",
    ],
  },
  {
    id: "content_creation",
    section: 2,
    label: "How do you handle content creation (social media, marketing, proposals)?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "content", scores: { 0: 2, 1: 3, 2: 3, 3: 1 } },
    options: [
      "We do it ourselves when we have time",
      "We have someone dedicated to it",
      "We outsource it",
      "We don't do much of this",
    ],
  },
  {
    id: "knowledge_management",
    section: 2,
    label: "How are internal documents, SOPs, or company knowledge stored and shared?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "content", scores: { 0: 1, 1: 2, 2: 3, 3: 4 } },
    options: [
      "In people's heads",
      "Shared drives or folders with no real structure",
      "A wiki or knowledge base",
      "We have documented and organized systems",
    ],
  },
  {
    id: "tech_comfort",
    section: 3,
    sectionTitle: "Your Relationship with Technology",
    label: "How would you rate your team's comfort level with adopting new technology?",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "technology", scores: { 0: 1, 1: 2, 2: 3, 3: 4 } },
    options: ["Resistant", "Cautious but open", "Generally comfortable", "We adopt early and often"],
  },
  {
    id: "ai_experience",
    section: 3,
    label: "Have you tried using any AI tools in your business? (ChatGPT, Copilot, automation tools, etc.)",
    type: "select",
    required: true,
    autoAdvance: true,
    scoring: { category: "technology", scores: { 0: 1, 1: 2, 2: 3, 3: 4 } },
    options: [
      "No, never",
      "We've experimented a little",
      "We use AI for a few things regularly",
      "AI is already embedded in our operations",
    ],
  },
  {
    id: "biggest_frustration",
    section: 3,
    label: "What is your biggest frustration in running your business day to day?",
    type: "textarea",
    required: false,
    placeholder: "Optional, but helpful for us to understand your situation",
  },
];


// ============================================================
// REPORT CONTENT LIBRARY
// ============================================================
const REPORT_CONTENT = {

  // ============================================================
  // CUSTOMER INTAKE (Operations)
  // ============================================================
  customer_intake: {
    category: "Operations Efficiency",
    title: "Customer Inquiry and Intake Management",
    answers: {
      "Phone/email manually": {
        interpretation: "Your team handles every inquiry by hand. Each call, email, or message requires someone to read it, decide what it needs, route it to the right person, and follow up. At your company size, this creates a bottleneck that slows response time and increases the chance of leads falling through the cracks.",
        benchmark: "Businesses that automate intake see response times drop from hours to minutes. A 30-person services firm that deployed an AI-powered intake form reduced processing time from 3 hours per client to 20 minutes and cut intake errors by 90%. The ROI on intake automation typically pays for itself within 60 days.",
        opportunity: "An automated intake system captures inquiries from every channel (web, email, phone), classifies them by type and urgency, routes them to the right team member, and sends an immediate confirmation to the customer. Your team only handles exceptions. Implementation takes 2 to 4 weeks and recovers 15 to 25 hours per month."
      },
      "A CRM or intake system": {
        interpretation: "You have infrastructure in place. A CRM or intake system means your data is centralized and your team has a defined process for capturing and tracking inquiries. This puts you ahead of most businesses your size.",
        benchmark: "Companies with CRM-based intake still leave value on the table if the system requires manual data entry or classification. The next level is AI-assisted triage: auto-categorizing inquiries, suggesting responses, and flagging high-priority leads for immediate attention. Businesses that add this layer see 30% faster response times on top of their existing system.",
        opportunity: "Layer AI classification on top of your current CRM. Inbound messages get auto-tagged by type, urgency, and intent. High-value leads get flagged immediately. Routine inquiries get draft responses for your team to review and send. Your CRM gets smarter without replacing anything you've already built."
      },
      "A mix of both": {
        interpretation: "A hybrid approach means some inquiries flow through a system while others get handled informally. This creates inconsistency. Customers who come through the formal channel get a different experience than those who reach you by phone or text. Important data lives in two places.",
        benchmark: "Mixed intake is the most common setup for businesses your size. The risk is that as volume grows, the informal side breaks first. Missed follow-ups, duplicate entries, and lost context become more frequent. Businesses that consolidate to a single intake point typically reduce response time by 40% and eliminate 80% of dropped leads.",
        opportunity: "Consolidate all intake into one system with AI routing. Every inquiry, regardless of how it arrives, gets captured, classified, and tracked. The informal channels don't disappear. They just feed into the same system. This is a 2 to 3 week implementation that immediately reduces dropped leads."
      },
      "We don't have a defined process": {
        interpretation: "Without a defined intake process, every customer interaction depends on whoever happens to be available. Response quality varies by person and day. There is no way to measure volume, response time, or conversion rate because nothing is tracked consistently.",
        benchmark: "This is more common than you'd think. Many businesses grow past the point where informal intake works but never formalize the process. The cost is invisible until you measure it: studies show businesses without defined intake processes lose 20 to 30% of inbound leads to slow response or no response at all.",
        opportunity: "Start with the basics: a single intake form or email address that captures every inquiry, an auto-response that confirms receipt, and a simple routing rule that assigns inquiries to the right person. AI can automate all three. This is a quick win that takes 1 to 2 weeks and creates immediate visibility into your pipeline."
      }
    }
  },

  // ============================================================
  // SCHEDULING (Operations)
  // ============================================================
  scheduling: {
    category: "Operations Efficiency",
    title: "Scheduling and Coordination",
    answers: {
      "Manually via phone/email/text": {
        interpretation: "Your scheduling runs on human effort. Every appointment, job, or meeting requires back-and-forth communication to find a time, confirm it, send reminders, and handle changes. This is one of the highest-volume repetitive tasks in any small business.",
        benchmark: "Manual scheduling costs the average small business 5 to 10 hours per week in coordination time. Automated scheduling tools reduce no-shows by 25 to 40% through automatic reminders and make rescheduling frictionless for customers. Businesses that switch from manual to automated scheduling recover the equivalent of a part-time employee's hours.",
        opportunity: "Deploy an AI-powered scheduling system that lets customers book directly, sends automatic confirmations and reminders, handles rescheduling without staff involvement, and syncs with your team's calendars. Implementation takes 1 to 2 weeks. No-shows drop immediately."
      },
      "A scheduling tool or software": {
        interpretation: "You already have a scheduling tool in place. Your customers can likely book or your team can coordinate without constant phone and email. This foundation means you've already captured the biggest efficiency gain.",
        benchmark: "The next opportunity is integration. Most scheduling tools operate as standalone systems. When connected to your CRM, invoicing, and communication tools, scheduling becomes the trigger for automated workflows: a booking auto-creates a client record, sends prep materials, and queues a follow-up task. Businesses that integrate scheduling into their broader workflow save an additional 5 to 8 hours per week.",
        opportunity: "Connect your scheduling tool to your other systems. A new booking should automatically create or update a client record, trigger a welcome sequence, and add relevant tasks to your team's workflow. AI-powered integrations make this possible without custom development."
      },
      "A mix": {
        interpretation: "Some scheduling flows through a tool while other coordination happens informally. This is common when businesses adopt a scheduling tool for client-facing bookings but still manage internal coordination or job scheduling manually.",
        benchmark: "The gap between your formal and informal scheduling creates inefficiency. When client bookings live in one system and job coordination lives in texts and emails, conflicts happen. Double-bookings, missed assignments, and scheduling gaps become more likely as volume increases.",
        opportunity: "Extend your scheduling tool to cover internal coordination or add a complementary tool for job scheduling. The goal is one source of truth for who is doing what and when. AI scheduling assistants can manage this across multiple channels and team members."
      },
      "We struggle with this": {
        interpretation: "Scheduling friction is costing you time, money, and customer satisfaction. Missed appointments, scheduling conflicts, and last-minute changes are likely a regular source of stress for your team.",
        benchmark: "Businesses that describe scheduling as a struggle typically lose 10 to 15% of potential revenue to no-shows, scheduling gaps, and coordination errors. The fix is not more effort. It is a system that removes the coordination burden from your team entirely.",
        opportunity: "This is a high-impact quick win. A scheduling system with AI-powered reminders, self-service booking, and automatic conflict detection can be deployed in 1 to 2 weeks. The reduction in no-shows alone typically covers the tool cost within the first month."
      }
    }
  },

  // ============================================================
  // ADMIN HOURS (Operations)
  // ============================================================
  admin_hours: {
    category: "Data & Performance Visibility",
    title: "Administrative Time and Repetitive Tasks",
    answers: {
      "Less than 5 hours": {
        interpretation: "Your admin overhead is low relative to most businesses your size. Either your team is small, your processes are already efficient, or administrative work is distributed in ways that make it feel lighter than it is.",
        benchmark: "Businesses reporting under 5 hours of admin time often undercount because the work is embedded in other tasks. A salesperson manually entering CRM data doesn't think of it as admin. A manager building a weekly report doesn't clock it as repetitive work. The real number is usually 2 to 3x what gets reported.",
        opportunity: "Even at 5 hours per week, targeted automation can recover meaningful time. Focus on the tasks that interrupt flow: manual data entry between systems, recurring report compilation, and routine email responses. Small automations in these areas compound over time."
      },
      "5 to 15 hours": {
        interpretation: "Your team is spending one to two full days per week on repetitive administrative work. At your company size, this represents significant payroll cost going to tasks that follow predictable patterns and could be handled by AI.",
        benchmark: "This is the most common range for businesses with 10 to 50 employees. The typical breakdown is: 30% data entry and system updates, 25% email and communication, 20% reporting and documentation, 15% scheduling and coordination, 10% other. AI automation can address 60 to 80% of this volume.",
        opportunity: "Map your top 5 admin tasks by weekly hours. The top 2 are almost always automatable. Businesses that automate their two highest-volume admin tasks typically recover 8 to 12 hours per week. That is $15K to $25K in annual payroll freed up for revenue-generating work."
      },
      "15 to 30 hours": {
        interpretation: "Your team is losing three to four full working days per week to repetitive tasks. For a company your size, this is roughly 25% of total payroll going to work that AI can partially or fully automate. This is a significant drag on growth and team morale.",
        benchmark: "At 15 to 30 hours per week, admin overhead typically indicates one or more of: manual processes that should be automated, data living in multiple disconnected systems, or a lack of templates and standard workflows. Businesses in this range see the fastest ROI from automation because the volume is high enough to produce dramatic before-and-after numbers.",
        opportunity: "This is your highest-impact opportunity area. A targeted automation initiative addressing your top 3 to 4 admin tasks can recover 15 to 20 hours per week within 60 days. That is the equivalent of hiring a half-time employee at zero ongoing cost. Start with the tasks your team complains about most."
      },
      "30+ hours": {
        interpretation: "Over 30 hours per week on admin tasks means your team is spending more time on process overhead than most businesses your size spend on any single function. This level of manual work is unsustainable as you grow and is likely already causing burnout, errors, and missed opportunities.",
        benchmark: "Businesses at this level typically have one or more critical processes that were never formalized. Work gets done through individual effort rather than repeatable systems. The good news: high admin hours mean high automation potential. Companies that go from 30+ hours to automated workflows typically see the most dramatic improvements in both efficiency and team satisfaction.",
        opportunity: "Prioritize ruthlessly. Identify the single process that consumes the most hours and automate it first. Do not try to fix everything at once. A phased approach starting with your biggest time drain will produce visible results within 2 to 3 weeks and build momentum for the next automation."
      },
      "No idea": {
        interpretation: "Not knowing how much time goes to admin work is a data point in itself. It means this overhead is invisible, which makes it impossible to manage or reduce. Your team is absorbing repetitive tasks without anyone tracking the total cost.",
        benchmark: "When businesses first measure their actual admin hours, the number is almost always higher than expected. A simple time audit over one week, where each team member logs repetitive tasks, typically reveals 15 to 25 hours of automatable work that was previously invisible.",
        opportunity: "Before automating anything, spend one week measuring. Have each team member track every task that feels repetitive: data entry, email follow-ups, report building, scheduling coordination. The audit itself costs nothing and gives you the data to prioritize your first automation investment."
      }
    }
  },

  // ============================================================
  // CUSTOMER ACQUISITION (Sales - multiselect)
  // ============================================================
  customer_acquisition: {
    category: "Sales & Customer Experience",
    title: "Customer Acquisition Channels",
    // For multiselect, content is based on selection count and specific picks
    answers: {
      "single_channel": {
        interpretation: "You are relying on a single channel to find customers. This creates concentration risk. If that channel slows down or becomes more competitive, your pipeline stalls with no backup.",
        benchmark: "Businesses with diversified acquisition channels (3 or more active sources) grow 2 to 3x faster than single-channel businesses. They also show more stable revenue because a dip in one channel gets offset by others.",
        opportunity: "AI can help you activate new channels without adding headcount. Automated content creation for social media, AI-powered ad targeting, and intelligent referral tracking can open 2 to 3 new channels within 30 days. Start with the channel closest to your existing strengths."
      },
      "diversified": {
        interpretation: "You have multiple channels generating customers. This is a strong position. Your growth is not dependent on any single source, and you have data on which channels perform best.",
        benchmark: "Businesses with 3+ acquisition channels benefit most from AI in two areas: attribution (knowing which channel actually drives the sale) and optimization (doubling down on what works). Most multi-channel businesses cannot accurately attribute revenue to the channel that initiated the relationship.",
        opportunity: "Use AI analytics to connect your acquisition channels to actual revenue outcomes. Which channels produce the highest-value customers? Which have the shortest sales cycle? This data lets you reallocate spend and effort to the channels with the best return."
      },
      "unsure": {
        interpretation: "Not knowing how customers find you means you cannot invest in what works or fix what doesn't. Every marketing dollar is a guess. This is one of the most common gaps in businesses your size and one of the easiest to fix.",
        benchmark: "Businesses that implement basic attribution tracking see immediate clarity on which efforts drive results. In many cases, 80% of revenue comes from 1 to 2 channels while the rest produce little. Without this data, businesses routinely overspend on low-performing channels.",
        opportunity: "Start with a simple question added to your intake process: 'How did you hear about us?' This single data point, tracked consistently, gives you acquisition intelligence within 30 days. AI can automate this collection and build attribution reports over time."
      },
      "word_of_mouth_heavy": {
        interpretation: "Word of mouth is your primary growth engine. This signals strong customer satisfaction and service quality. It also means your growth rate is limited by how often existing customers talk about you, which you cannot control or scale directly.",
        benchmark: "Word-of-mouth dependent businesses typically grow 10 to 15% annually. Adding one structured channel (referral program, content marketing, or targeted outreach) typically increases growth rate to 20 to 30%. AI-powered referral tracking and automated ask sequences can formalize what currently happens organically.",
        opportunity: "Formalize your referral engine. AI can identify your best referral sources, automate the ask at the right moment in the customer lifecycle, track referral outcomes, and reward the behavior you want to see more of. This turns an organic strength into a scalable system."
      }
    }
  },

  // ============================================================
  // SALES PROCESS (Sales)
  // ============================================================
  sales_process: {
    category: "Sales & Customer Experience",
    title: "Sales Process Maturity",
    answers: {
      "We respond when people reach out": {
        interpretation: "Your sales approach is reactive. Business comes to you, and you respond. There is no outbound motion, no structured follow-up, and no system for nurturing leads who are not ready to buy today. This works when demand is strong but leaves you vulnerable when it slows.",
        benchmark: "Reactive sales businesses close only the leads that are ready to buy right now. Research shows that 50% of qualified leads are not ready to purchase immediately but will buy within 12 months. Without follow-up, those leads go to competitors. Businesses that add structured follow-up see 15 to 25% increases in close rates.",
        opportunity: "Start with automated follow-up. When someone inquires but doesn't convert, an AI-powered email sequence keeps you top of mind with useful content. When they are ready to buy, you are the first call. This requires no sales training and no additional staff. A basic nurture sequence can be deployed in 1 to 2 weeks."
      },
      "We have a basic follow-up process": {
        interpretation: "You follow up with leads, which puts you ahead of businesses that don't. The question is consistency. Basic follow-up processes often depend on individual effort and get dropped when the team is busy. Leads that needed a third or fourth touch get abandoned.",
        benchmark: "80% of sales require 5 or more follow-up contacts. Most salespeople give up after 2. Businesses that automate their follow-up cadence and extend it to 5 to 7 touches see conversion rates increase by 20 to 35%. The key is persistence without being annoying, which AI-generated personalized messaging handles well.",
        opportunity: "Automate and extend your follow-up sequence. AI can generate personalized follow-up messages based on the lead's industry, inquiry type, and engagement history. Your team focuses on the leads that respond. The system handles the cadence."
      },
      "We have a structured pipeline with stages": {
        interpretation: "A structured pipeline means you can see where every deal stands, what needs to happen next, and where deals are getting stuck. This is a significant competitive advantage at your company size.",
        benchmark: "Businesses with structured pipelines benefit most from AI in two areas: deal velocity (moving deals through stages faster) and forecasting (predicting which deals will close and when). AI can analyze your pipeline patterns and identify which deals need attention before they stall.",
        opportunity: "Add AI-powered pipeline intelligence. Automatic alerts when deals stall beyond your average stage duration. Suggested next actions based on what worked for similar deals. Predictive close probability based on deal characteristics. These additions increase forecast accuracy by 25 to 40%."
      },
      "We use a CRM to manage everything": {
        interpretation: "Full CRM adoption means your sales data is centralized and your process is systematic. This is the strongest foundation for AI-powered sales optimization because the data is already there.",
        benchmark: "Most businesses use 20 to 30% of their CRM's capabilities. The AI features built into modern CRMs (lead scoring, activity capture, send-time optimization, response suggestions) often go unused. Activating these existing features is typically the fastest win because there is no new tool to buy or learn.",
        opportunity: "Audit your CRM's AI features. Most modern platforms include lead scoring, email analytics, and automation capabilities that are included in your subscription but not configured. A focused activation sprint can unlock significant value from tools you already pay for."
      }
    }
  },

  // ============================================================
  // PERFORMANCE TRACKING (Data)
  // ============================================================
  performance_tracking: {
    category: "Data & Performance Visibility",
    title: "Business Performance Tracking",
    answers: {
      "Spreadsheets": {
        interpretation: "Spreadsheets are flexible but fragile. They require manual updates, they break when someone edits the wrong cell, and they cannot refresh automatically. Your business intelligence depends on someone remembering to update a file, and the data is only as current as the last time someone touched it.",
        benchmark: "Businesses that move from spreadsheet-based reporting to automated dashboards save 2 to 3 days per month on report preparation and get real-time visibility instead of backward-looking snapshots. The shift from 'here's what happened last month' to 'here's what's happening now' changes decision quality.",
        opportunity: "Connect your data sources (accounting software, CRM, operational systems) to an automated dashboard. AI-powered tools like Power BI, Looker, or even enhanced Google Sheets can pull data automatically, build visual reports, and flag anomalies. The manual spreadsheet becomes a live dashboard in 4 to 6 weeks."
      },
      "Accounting software like QuickBooks": {
        interpretation: "You have financial visibility but limited operational visibility. QuickBooks tells you what happened financially but not why. Revenue is up, but which customers drove it? Costs increased, but in which processes? The gap between financial data and operational insight is where decisions go wrong.",
        benchmark: "Businesses that layer operational metrics on top of financial tracking make faster and better decisions. Connecting customer data, project data, and team productivity data to your financial picture creates a complete view. Companies that do this catch margin erosion 4 to 6 weeks earlier than those relying on financial data alone.",
        opportunity: "Expand beyond financial tracking. Connect your QuickBooks data to customer and operational metrics using AI-powered reporting tools. A dashboard that shows revenue by customer segment, cost by process, and margin by service line gives you the operational intelligence that financial software alone cannot provide."
      },
      "A dashboard or BI tool": {
        interpretation: "You have advanced visibility. A dashboard or BI tool means your data is connected, visualized, and accessible. This puts you in the top tier of businesses your size for data maturity.",
        benchmark: "The next level is predictive analytics. Your current dashboard shows you what happened and what is happening. AI-powered analytics can tell you what is likely to happen next. Demand forecasting, churn prediction, and cash flow modeling are now accessible to businesses your size through AI tools that don't require data science expertise.",
        opportunity: "Add predictive capabilities to your existing dashboard. AI models can analyze your historical data patterns and generate forecasts for revenue, demand, and resource needs. This moves your decision-making from reactive to proactive. Implementation typically takes 4 to 8 weeks on top of an existing data infrastructure."
      },
      "We don't track this consistently": {
        interpretation: "Without consistent tracking, decisions are based on gut feel and memory. You cannot identify trends, catch problems early, or prove what is working. This is the biggest data gap a business can have.",
        benchmark: "Businesses that go from no tracking to basic tracking see the fastest improvement in decision quality. You do not need a sophisticated system to start. Tracking three numbers consistently (revenue, customer acquisition cost, and one operational metric specific to your business) provides more value than most businesses realize.",
        opportunity: "Start with one dashboard that tracks three metrics you care about most. AI tools can automatically pull data from your existing systems and present it without manual entry. The goal is not perfection. The goal is consistency. Once you see your numbers weekly, patterns emerge that drive better decisions."
      }
    }
  },

  // ============================================================
  // CONTENT CREATION (Content)
  // ============================================================
  content_creation: {
    category: "Content & Knowledge Management",
    title: "Content Creation and Marketing",
    answers: {
      "We do it ourselves when we have time": {
        interpretation: "Content happens when capacity allows, which means it doesn't happen consistently. Marketing, social media, proposals, and customer-facing materials get pushed to the bottom of the priority list when operations get busy. This creates a feast-or-famine cycle where marketing only happens during slow periods.",
        benchmark: "Businesses that post consistently on even one channel (2 to 3 times per week) generate 3x more leads than those that post sporadically. Consistency matters more than quality at this stage. AI writing assistants can produce solid first drafts in minutes, cutting content creation time by 60 to 80%.",
        opportunity: "Use AI to break the capacity constraint. AI writing tools can generate social media posts, email drafts, proposal templates, and blog content from simple prompts. Your team reviews and approves instead of creating from scratch. A one-hour weekly content session with AI assistance can produce a full week of marketing output."
      },
      "We have someone dedicated to it": {
        interpretation: "Dedicated content capacity is a significant advantage. Your marketing and communications have consistency and quality because someone owns it. The question is whether that person's time is optimized or spent on tasks AI could handle.",
        benchmark: "Content creators who use AI tools produce 2 to 3x more output at the same quality level. The time saved on first drafts, research, and formatting gets redirected to strategy, distribution, and engagement. Businesses that equip their content teams with AI see faster publishing cadence and more experimentation with formats and channels.",
        opportunity: "Equip your content person with AI tools that accelerate their workflow. AI-assisted research, draft generation, image creation, and performance analytics let them focus on strategy and creativity instead of production. The same person produces more output with less effort."
      },
      "We outsource it": {
        interpretation: "Outsourcing content gives you professional output without in-house overhead. The tradeoffs are cost, turnaround time, and the agency's ability to capture your voice and industry expertise authentically.",
        benchmark: "Businesses that outsource content often spend $2K to $10K per month for a consistent marketing presence. AI tools can reduce this cost by 40 to 60% by handling first drafts, social posts, and routine content in-house while reserving agency resources for high-value strategic work like campaigns and brand development.",
        opportunity: "Use AI to bring some content creation in-house for routine output (social posts, email newsletters, proposal drafts) while keeping your agency focused on strategic initiatives. This reduces monthly spend while increasing total content volume."
      },
      "We don't do much of this": {
        interpretation: "Limited content creation means your business is invisible online between direct interactions. Potential customers researching solutions in your space will find competitors instead of you. Existing customers have no reason to remember you between purchases.",
        benchmark: "Businesses with no content presence rely entirely on word of mouth and direct outreach for growth. Adding even basic content (a monthly email to your customer list, a weekly social post, and an updated website) increases inbound inquiries by 30 to 50% within 90 days according to small business marketing studies.",
        opportunity: "AI makes starting from zero viable. A single weekly session using AI writing tools can produce: 3 to 5 social media posts, 1 email to your customer list, and ongoing website content. The time investment is 1 to 2 hours per week. The cost is near zero. Start small, stay consistent, and build from there."
      }
    }
  },

  // ============================================================
  // KNOWLEDGE MANAGEMENT (Content)
  // ============================================================
  knowledge_management: {
    category: "Content & Knowledge Management",
    title: "Internal Knowledge and Documentation",
    answers: {
      "In people's heads": {
        interpretation: "Your business knowledge is not documented. When someone is absent, quits, or retires, their knowledge leaves with them. Training new hires takes longer because there is nothing written to learn from. The same questions get asked and answered repeatedly because there is no reference to point to.",
        benchmark: "Businesses with tribal knowledge lose an average of 20 to 30% productivity per new hire during the first 90 days compared to those with documented processes. Senior staff spend 8 to 12 hours per week answering the same questions. AI-powered knowledge management eliminates this by making answers searchable and available instantly.",
        opportunity: "Build a knowledge base. Start by recording your top 20 frequently asked internal questions and their answers. AI can help extract knowledge from experienced team members through structured interviews and convert it to searchable documentation. A basic internal knowledge base can be operational in 3 to 4 weeks."
      },
      "Shared drives or folders with no real structure": {
        interpretation: "Your knowledge exists but it's scattered. Documents, SOPs, and reference materials live in folders that only the person who created them can navigate. Finding the right document takes longer than it should, and teams often re-create content that already exists somewhere.",
        benchmark: "Employees spend an average of 1.8 hours per day searching for information. In a 20-person company, that is 36 hours of lost productivity every day. AI-powered search across your existing documents can reduce this to minutes by understanding natural language queries instead of requiring exact file names or folder paths.",
        opportunity: "Deploy AI-powered search across your existing shared drives. No need to reorganize everything first. AI tools can index your current documents and make them searchable by topic, question, or keyword. Over time, add structure by tagging the most-accessed documents. This delivers immediate value without a major reorganization project."
      },
      "A wiki or knowledge base": {
        interpretation: "You have a centralized knowledge system. Information is organized and accessible. This is a strong foundation that most businesses your size lack. The key question is whether the content stays current and whether the team actually uses it.",
        benchmark: "Knowledge bases lose value when content goes stale. The most effective systems have AI-powered maintenance: automated flags when content hasn't been reviewed in 90 days, usage analytics showing which articles get accessed most, and gap detection that identifies questions being asked that have no matching article.",
        opportunity: "Add AI to your existing knowledge base. Natural language search, auto-suggested articles based on context, and content freshness monitoring keep your knowledge base useful as it grows. If your team already uses the system, these additions increase adoption and reduce the time spent searching."
      },
      "We have documented and organized systems": {
        interpretation: "Your documentation and knowledge management are mature. Processes are written, organized, and accessible. This is the strongest position for AI enhancement because the foundation is already solid.",
        benchmark: "Businesses with mature documentation are positioned for AI-powered automation that goes beyond search. Your documented processes can be converted into automated workflows, training modules, and customer-facing resources. The documentation itself becomes the instruction set for AI tools.",
        opportunity: "Convert your documentation into active systems. SOPs become automated checklists. Training documents become interactive onboarding modules. Customer-facing knowledge becomes an AI-powered help center. Your existing documentation is the raw material for the next level of operational efficiency."
      }
    }
  },

  // ============================================================
  // TECH COMFORT (Technology)
  // ============================================================
  tech_comfort: {
    category: "Technology Readiness",
    title: "Team Technology Adoption",
    answers: {
      "Resistant": {
        interpretation: "Your team pushes back on new technology. This is often rooted in past experiences with poorly implemented tools, fear of job displacement, or leadership that hasn't communicated the why behind the change. Resistance is not a character flaw. It is a signal that change management matters more than tool selection.",
        benchmark: "Technology resistance is the number one reason AI implementations fail in small businesses. It is not a technology problem. It is a people problem. Companies that address resistance through involvement (letting the team help select tools), transparency (explaining what will and won't change), and quick wins (showing value within the first week) see adoption rates 3x higher than those that mandate change.",
        opportunity: "Start with a tool that makes one person's job noticeably easier. Not the whole team. One person, one pain point, one visible win. When their colleagues see the result, curiosity replaces resistance. AI implementation for resistant teams works best as a pull strategy, not a push."
      },
      "Cautious but open": {
        interpretation: "Your team is willing to try new tools but wants proof before committing. They need to see value before they invest effort in learning something new. This is a healthy attitude that protects against chasing trends while remaining open to genuine improvement.",
        benchmark: "Cautious teams adopt fastest when they can test without risk. Free trials, sandbox environments, and low-stakes pilot projects give them hands-on experience without the pressure of a full commitment. Businesses with cautious teams that run 2-week pilot programs before full rollout see 70% higher long-term adoption.",
        opportunity: "Run a pilot. Pick one AI tool, one team member, and one process. Two weeks. No commitment beyond the pilot. Measure the before and after. If it works, expand. If it doesn't, you've lost nothing. This approach respects your team's caution while proving value with evidence."
      },
      "Generally comfortable": {
        interpretation: "Your team adapts to new tools without major friction. They may not seek out technology proactively, but they can learn and adopt when something useful is introduced. This is the most common profile for businesses that are ready for AI implementation.",
        benchmark: "Comfortable teams benefit from structured rollout plans. Without structure, they may adopt tools inconsistently, with some team members using features others don't know about. A brief training session and a shared playbook for each new tool ensures everyone gets the same value.",
        opportunity: "Your team is ready for a multi-tool AI deployment. Start with 2 to 3 AI tools across different functions (operations, communication, content) and roll them out over 4 to 6 weeks. Your team's comfort with technology means you can move faster than businesses that need extensive change management."
      },
      "We adopt early and often": {
        interpretation: "Your team embraces new technology. This is a competitive advantage that accelerates every AI initiative. The risk at this level is tool sprawl: adopting too many tools without integrating them or measuring their impact.",
        benchmark: "Early adopter teams often have 3 to 5 AI tools already in use. The opportunity is not adding more tools. It is connecting the ones they have into a coherent system. Businesses that integrate their AI tools into unified workflows see 40% more value than those running tools in isolation.",
        opportunity: "Consolidate and integrate. Audit the AI tools your team already uses. Identify overlaps, gaps, and integration opportunities. Build workflows that connect tools across functions. Your team's willingness to adopt means the bottleneck is architecture, not adoption."
      }
    }
  },

  // ============================================================
  // AI EXPERIENCE (Technology)
  // ============================================================
  ai_experience: {
    category: "Technology Readiness",
    title: "Current AI Usage",
    answers: {
      "No, never": {
        interpretation: "You have not used AI in your business. This is a clean starting point. There are no bad habits to unlearn and no sunk costs in the wrong tools. The entire landscape of AI tools is available to you, and starting now means starting with the most current and capable options.",
        benchmark: "Businesses that start AI adoption in 2025 and 2026 have access to tools that are dramatically more capable and affordable than what was available even 12 months ago. The learning curve has flattened. Tools that required technical expertise now work through natural language. The barrier to entry has never been lower.",
        opportunity: "Start with one AI tool for one task. The most common first use cases are: AI writing assistants for email and content, AI scheduling tools for appointment management, or AI-powered document processing. Pick the one that addresses your biggest daily friction. Master it. Then expand."
      },
      "We've experimented a little": {
        interpretation: "You've tested AI but haven't made it a consistent part of your operations. Experimentation is the right first step. The gap is moving from occasional use to embedded workflow. Most businesses stall here because the experiment showed promise but nobody owned the next step.",
        benchmark: "The drop-off between AI experimentation and consistent use is steep. 70% of businesses that try AI tools revert to old methods within 60 days. The ones that stick share a common pattern: they tied the AI tool to a specific, recurring task with a clear owner. Not general-purpose use. Specific task. Specific person. Specific schedule.",
        opportunity: "Pick the AI experiment that showed the most promise. Assign it to one person. Make it their default tool for that specific task for 30 days. Measure the impact. The goal is making one AI tool a permanent part of how one task gets done. That foothold becomes the foundation for broader adoption."
      },
      "We use AI for a few things regularly": {
        interpretation: "AI is already part of your operations in specific areas. You have proven the value and built some internal expertise. The next step is expanding from isolated use cases to connected AI workflows that compound each other's value.",
        benchmark: "Businesses using AI regularly in 2 to 3 areas are positioned for the highest ROI expansion. They have internal champions, proven results, and institutional knowledge about what works. Expanding from 3 use cases to 6 typically doubles the total value because the new use cases benefit from data and workflows the existing ones create.",
        opportunity: "Map your current AI use cases and identify the adjacent opportunities. If you use AI for content creation, the next step might be AI-powered distribution and analytics. If you use AI for email triage, the next step might be automated response drafting. Each expansion builds on what you already have."
      },
      "AI is already embedded in our operations": {
        interpretation: "AI is woven into how your business runs. This is the most mature AI posture a business your size can have. Your competitive advantage is not just the tools. It is the operational knowledge your team has built about how to use them effectively.",
        benchmark: "Businesses with embedded AI are ready for advanced applications: predictive analytics, automated decision support, and AI-powered customer experiences. They also benefit most from AI strategy work because the foundation supports sophisticated implementations that would fail without the maturity you've already built.",
        opportunity: "Your next moves are optimization and innovation. Optimize existing AI workflows for efficiency and accuracy. Then look at the problems you've assumed can't be solved with AI. At your maturity level, custom solutions and advanced applications become viable. This is where AI starts creating competitive advantages your industry hasn't seen yet."
      }
    }
  }
};




function getAcquisitionContent(answers) {
  const selected = Array.isArray(answers.customer_acquisition) ? answers.customer_acquisition : [];
  const hasUnsure = selected.includes("We're not sure");
  const hasWordOfMouth = selected.includes("Word of mouth");
  const nonWomChannels = selected.filter(s => s !== "Word of mouth" && s !== "We're not sure");
  
  if (hasUnsure || selected.length === 0) return REPORT_CONTENT.customer_acquisition.answers.unsure;
  if (selected.length === 1 && hasWordOfMouth) return REPORT_CONTENT.customer_acquisition.answers.word_of_mouth_heavy;
  if (selected.length === 1) return REPORT_CONTENT.customer_acquisition.answers.single_channel;
  if (hasWordOfMouth && nonWomChannels.length === 0) return REPORT_CONTENT.customer_acquisition.answers.word_of_mouth_heavy;
  if (selected.length >= 3) return REPORT_CONTENT.customer_acquisition.answers.diversified;
  return REPORT_CONTENT.customer_acquisition.answers.single_channel;
}

function getDynamicCTA(score) {
  if (score < 40) return { heading: "Let's find your starting point", desc: "Your assessment shows significant opportunity. We will walk through your results, identify the highest-impact first step, and give you a clear path forward." };
  if (score < 65) return { heading: "You have real opportunities. Let's prioritize them", desc: "Your business has a solid base with clear areas for improvement. We will review your scorecard, rank the opportunities by impact, and map out a realistic timeline." };
  if (score < 85) return { heading: "You're ready to move. Let's build your roadmap", desc: "Your operations are strong. The right AI implementations can compound what is already working. We will identify the specific moves that deliver the most value at your stage." };
  return { heading: "Let's fine-tune your competitive edge", desc: "Your AI maturity is well ahead of most businesses your size. We will explore advanced applications and optimization strategies that match your level." };
}

function generatePDFContent(answers, scores, quickWins) {
  const sections = [];
  const scoredQuestions = [
    { id: "customer_intake", cat: "operations", label: "How do you currently manage customer inquiries or intake?" },
    { id: "scheduling", cat: "operations", label: "How do you handle scheduling, appointments, or job coordination?" },
    { id: "admin_hours", cat: "data", label: "How much time per week does your team spend on repetitive admin tasks?" },
    { id: "customer_acquisition", cat: "sales", label: "How do your customers typically find you?" },
    { id: "sales_process", cat: "sales", label: "What does your sales process look like?" },
    { id: "performance_tracking", cat: "data", label: "How do you currently track business performance?" },
    { id: "content_creation", cat: "content", label: "How do you handle content creation?" },
    { id: "knowledge_management", cat: "content", label: "How are internal documents and company knowledge stored?" },
    { id: "tech_comfort", cat: "technology", label: "How would you rate your team's comfort with new technology?" },
    { id: "ai_experience", cat: "technology", label: "Have you tried using any AI tools in your business?" },
  ];

  // Find lowest category score for impact flagging
  const catScores = scores.categories;
  const sortedCats = Object.entries(catScores).sort((a, b) => a[1].score - b[1].score);
  const lowestCatKeys = sortedCats.filter(([, v]) => v.score < 70).map(([k]) => k);

  scoredQuestions.forEach(q => {
    const answer = answers[q.id];
    if (!answer) return;
    
    let contentBlock;
    if (q.id === "customer_acquisition") {
      contentBlock = getAcquisitionContent(answers);
    } else if (REPORT_CONTENT[q.id]) {
      const answerStr = Array.isArray(answer) ? answer.join(", ") : answer;
      contentBlock = REPORT_CONTENT[q.id].answers[answerStr];
    }
    
    if (contentBlock) {
      sections.push({
        question: q.label,
        answer: Array.isArray(answer) ? answer.join(", ") : answer,
        category: REPORT_CONTENT[q.id]?.category || "",
        categoryKey: q.cat,
        categoryScore: catScores[q.cat]?.score || 0,
        title: REPORT_CONTENT[q.id]?.title || "",
        isHighImpact: lowestCatKeys.includes(q.cat),
        ...contentBlock
      });
    }
  });

  // Sort by category score ascending (weakest areas first)
  sections.sort((a, b) => a.categoryScore - b.categoryScore);

  return sections;
}

function calculateScores(answers) {
  const categories = {
    operations: { scores: [], label: "Operations Efficiency" },
    sales: { scores: [], label: "Sales & Customer Experience" },
    data: { scores: [], label: "Data & Performance Visibility" },
    content: { scores: [], label: "Content & Knowledge Management" },
    technology: { scores: [], label: "Technology Readiness" },
  };

  QUESTIONS.forEach((q) => {
    if (!q.scoring) return;
    const answer = answers[q.id];
    if (answer === undefined || answer === null || answer === "") return;

    if (q.type === "multiselect") {
      const selected = Array.isArray(answer) ? answer : [];
      const hasUnsure = selected.includes("We're not sure");
      let score;
      if (hasUnsure || selected.length === 0) score = 1;
      else if (selected.length === 1) score = 2;
      else if (selected.length <= 3) score = 3;
      else score = 4;
      categories[q.scoring.category].scores.push(score);
    } else if (q.scoring.scores) {
      const idx = typeof answer === "number" ? answer : q.options?.indexOf(answer) ?? -1;
      if (idx >= 0 && q.scoring.scores[idx] !== undefined) {
        categories[q.scoring.category].scores.push(q.scoring.scores[idx]);
      }
    }
  });

  const results = {};
  let totalScore = 0;
  let totalCategories = 0;

  Object.entries(categories).forEach(([key, cat]) => {
    if (cat.scores.length > 0) {
      const avg = cat.scores.reduce((a, b) => a + b, 0) / cat.scores.length;
      const normalized = Math.round((avg / 4) * 100);
      results[key] = { score: normalized, label: cat.label, raw: avg };
      totalScore += normalized;
      totalCategories++;
    }
  });

  const overall = totalCategories > 0 ? Math.round(totalScore / totalCategories) : 0;
  return { overall, categories: results };
}

function calculateLeadQuality(answers) {
  let score = 0;
  const emp = answers.employee_count;
  if (emp === "11 to 50") score += 30;
  else if (emp === "51 to 200") score += 25;
  else if (emp === "2 to 10") score += 15;
  else if (emp === "201+") score += 20;
  else score += 5;

  const rev = answers.annual_revenue;
  if (rev === "$1M to $5M") score += 30;
  else if (rev === "$5M to $20M") score += 30;
  else if (rev === "$20M+") score += 25;
  else if (rev === "$500K to $1M") score += 15;
  else if (rev === "Under $500K") score += 5;
  else score += 10;

  const admin = answers.admin_hours;
  if (admin === "30+ hours") score += 25;
  else if (admin === "15 to 30 hours") score += 20;
  else if (admin === "5 to 15 hours") score += 10;
  else score += 5;

  const ai = answers.ai_experience;
  if (ai === "No, never") score += 15;
  else if (ai === "We've experimented a little") score += 15;
  else if (ai === "We use AI for a few things regularly") score += 10;
  else score += 5;

  if (answers.years_in_business === "3 to 10 years" || answers.years_in_business === "10+ years") score += 5;

  let tier;
  if (score >= 75) tier = "HIGH";
  else if (score >= 50) tier = "MEDIUM";
  else tier = "LOW";
  return { score, tier };
}

function generateQuickWins(answers, categoryScores) {
  const wins = [];
  const sorted = Object.entries(categoryScores).sort((a, b) => a[1].score - b[1].score);

  sorted.forEach(([key, cat]) => {
    if (key === "operations" && cat.score < 80) {
      if (answers.customer_intake === "Phone/email manually" || answers.customer_intake === "We don't have a defined process") {
        wins.push({ category: cat.label, title: "Automate Customer Intake", desc: "Every inquiry that sits in an inbox or voicemail is revenue at risk. AI can categorize, route, and auto-respond to common requests so your team focuses on qualified conversations." });
      }
      if (answers.scheduling === "Manually via phone/email/text" || answers.scheduling === "We struggle with this") {
        wins.push({ category: cat.label, title: "Streamline Scheduling and Coordination", desc: "Manual scheduling creates missed appointments and wasted back-and-forth. Automated scheduling tools can reduce coordination time by 60% or more." });
      } else if (answers.scheduling === "A mix") {
        wins.push({ category: cat.label, title: "Consolidate Your Scheduling Workflow", desc: "You're partially automated but still relying on manual coordination. Unifying your scheduling into a single automated system eliminates the gaps where things fall through." });
      }
    }
    if (key === "sales" && cat.score < 80) {
      if (answers.sales_process === "We respond when people reach out") {
        wins.push({ category: cat.label, title: "Build a Proactive Sales Pipeline", desc: "Waiting for inbound means you're leaving revenue on the table. AI can identify warm leads, automate initial outreach, and keep prospects engaged without adding headcount." });
      } else if (answers.sales_process === "We have a basic follow-up process") {
        wins.push({ category: cat.label, title: "Strengthen Your Follow-Up System", desc: "You have a process, but leads are likely slipping through. AI-assisted follow-up sequences ensure every prospect gets timely, consistent touchpoints without manual tracking." });
      }
      const acq = Array.isArray(answers.customer_acquisition) ? answers.customer_acquisition : [];
      if (acq.length <= 2 && !acq.includes("We're not sure")) {
        wins.push({ category: cat.label, title: "Diversify How Customers Find You", desc: "You're relying on a narrow set of channels. AI-powered content and ad targeting can open new acquisition paths without requiring a dedicated marketing team." });
      }
    }
    if (key === "data" && cat.score < 80) {
      if (answers.admin_hours === "30+ hours" || answers.admin_hours === "15 to 30 hours") {
        wins.push({ category: cat.label, title: "Reduce Admin Overhead", desc: "Your team is burning 15+ hours a week on tasks a machine can handle. Invoicing, follow-ups, data entry, and reporting are all candidates for immediate automation." });
      } else if (answers.admin_hours === "5 to 15 hours") {
        wins.push({ category: cat.label, title: "Eliminate Remaining Manual Bottlenecks", desc: "You've kept admin work manageable, but there are still hours being spent on tasks AI can handle faster. Targeted automation on your top 2 to 3 repetitive workflows will free up capacity." });
      }
      if (answers.performance_tracking === "We don't track this consistently") {
        wins.push({ category: cat.label, title: "Establish Automated Performance Tracking", desc: "You're running your business without consistent visibility into what's working. AI dashboards can pull data from your existing tools and surface the metrics that matter most." });
      } else if (answers.performance_tracking === "Spreadsheets") {
        wins.push({ category: cat.label, title: "Upgrade from Spreadsheets to Automated Reporting", desc: "Spreadsheets require manual updates and are prone to error. AI-connected dashboards pull live data from your systems and keep your numbers current without the manual lift." });
      } else if (answers.performance_tracking === "Accounting software like QuickBooks") {
        wins.push({ category: cat.label, title: "Expand Beyond Financial Tracking", desc: "Your accounting data tells part of the story. AI can connect your financial tools with customer, operations, and sales data to give you a complete picture of business performance." });
      }
    }
    if (key === "content" && cat.score < 80) {
      if (answers.knowledge_management === "In people's heads") {
        wins.push({ category: cat.label, title: "Capture and Organize Company Knowledge", desc: "When key people leave, their knowledge walks out the door. AI can help extract, document, and organize institutional knowledge into a searchable system your whole team can use." });
      } else if (answers.knowledge_management === "Shared drives or folders with no real structure") {
        wins.push({ category: cat.label, title: "Bring Structure to Your Shared Knowledge", desc: "Your files exist but nobody can find them. AI-powered search and auto-tagging can turn your messy shared drives into an organized, instantly searchable knowledge base." });
      }
      if (answers.content_creation === "We don't do much of this") {
        wins.push({ category: cat.label, title: "Launch AI Assisted Content Creation", desc: "You're invisible to prospects who search before they buy. AI can draft social posts, proposals, and marketing copy in your voice so you show up where your customers are looking." });
      } else if (answers.content_creation === "We do it ourselves when we have time") {
        wins.push({ category: cat.label, title: "Accelerate Your Content Output", desc: "Your team creates content when they can, which means inconsistently. AI writing tools can turn a 2-hour blog post into a 20-minute review, keeping your pipeline of content steady." });
      }
    }
    if (key === "technology" && cat.score < 80) {
      if (answers.ai_experience === "No, never") {
        wins.push({ category: cat.label, title: "Start with Simple AI Tools", desc: "Your team hasn't used AI yet, which means every improvement is net new value. There are low-risk tools you can adopt this week that will save hours immediately." });
      } else if (answers.ai_experience === "We've experimented a little") {
        wins.push({ category: cat.label, title: "Move from Experimentation to Execution", desc: "You've tested the waters. The next step is identifying 1 to 2 workflows where AI becomes a permanent part of how your team operates, with measurable time savings." });
      }
      if (answers.tech_comfort === "Resistant") {
        wins.push({ category: cat.label, title: "Build Team Confidence with Quick Wins", desc: "Resistance to new technology usually comes from bad past experiences. Starting with tools that solve a visible daily pain point builds trust and opens the door to bigger changes." });
      } else if (answers.tech_comfort === "Cautious but open") {
        wins.push({ category: cat.label, title: "Turn Openness into Adoption", desc: "Your team is willing to try new tools. The key is giving them something that makes their job easier within the first week, with minimal training required." });
      }
    }
  });

  // Always include a growth/acquisition quick win regardless of scores
  const salesScore = categoryScores.sales ? categoryScores.sales.score : 50;
  if (!wins.find(w => w.title.includes("Revenue") || w.title.includes("Upsell") || w.title.includes("Customer Value"))) {
    if (salesScore >= 80) {
      wins.push({ category: "Sales & Customer Experience", title: "Maximize Customer Lifetime Value", desc: "Your sales operations are strong. The next lever is identifying which customers generate the highest margins and where expansion revenue is hiding. AI can analyze purchase patterns, predict churn risk, and surface upsell opportunities your team would otherwise miss." });
    } else {
      wins.push({ category: "Sales & Customer Experience", title: "Unlock Revenue You're Already Sitting On", desc: "Most businesses focus on new customer acquisition and overlook the revenue sitting in their existing base. AI-powered customer segmentation can identify your highest-margin clients, predict which prospects look like them, and flag upsell opportunities that your team can act on this month." });
    }
  }

  if (wins.length < 3) {
    const fillers = [
      { category: "Operations Efficiency", title: "Audit Your Most Time-Intensive Workflows", desc: "Even well-run operations have hidden inefficiencies. A targeted workflow audit can identify 2 to 3 processes where AI automation delivers immediate ROI." },
      { category: "Technology Readiness", title: "Build an AI Adoption Roadmap", desc: "Knowing where you stand is the first step. A structured 90-day plan can move your team from awareness to active AI usage without disrupting what's already working." },
      { category: "Sales & Customer Experience", title: "Improve Response Time to Customer Inquiries", desc: "Speed to response is one of the biggest drivers of conversion. AI-assisted responses can cut your reply time from hours to minutes for common inquiries." },
    ];
    for (const f of fillers) {
      if (wins.length >= 5) break;
      if (!wins.find((w) => w.title === f.title)) wins.push(f);
    }
  }
  return wins.slice(0, 5);
}

function Gauge({ score, size = 180, label, isOverall = false }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const gaugeSize = isOverall ? 680 : size;
  const strokeWidth = isOverall ? 36 : Math.max(10, size * 0.055);
  const radius = (gaugeSize - strokeWidth) / 2 * 0.78;
  const circumference = 2 * Math.PI * radius;
  const gapAngle = 80;
  const arcLength = circumference * (1 - gapAngle / 360);
  const gapLength = circumference * (gapAngle / 360);
  const rotation = 90 + gapAngle / 2;

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const getColor = (s) => {
    if (s < 30) return "#E84855";
    if (s < 50) return "#F5733A";
    if (s < 65) return "#F5A623";
    if (s < 80) return "#E8D44D";
    if (s < 90) return "#7BC67E";
    return "#34C759";
  };

  const color = getColor(animatedScore);
  const filledLength = (animatedScore / 100) * arcLength;
  const cx = gaugeSize / 2;
  const cy = gaugeSize / 2;
  const svgHeight = gaugeSize * 0.6;

  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={gaugeSize} height={svgHeight} viewBox={`0 0 ${gaugeSize} ${gaugeSize}`} style={{ display: "block", overflow: "hidden" }}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={BRAND.navyLight} strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${gapLength}`} strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`} />
        {animatedScore > 0 && (
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${filledLength} ${circumference - filledLength}`} strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
            style={{ filter: isOverall ? `drop-shadow(0 0 16px ${color}80)` : `drop-shadow(0 0 6px ${color}50)` }} />
        )}
        <text x={cx} y={cy - (isOverall ? 28 : gaugeSize * 0.03)} textAnchor="middle" dominantBaseline="middle" fill={BRAND.white} fontSize={isOverall ? 120 : gaugeSize * 0.28} fontWeight="700" fontFamily="'DM Sans', sans-serif">
          {animatedScore}
        </text>
        <text x={cx} y={cy + (isOverall ? 52 : gaugeSize * 0.16)} textAnchor="middle" fill={BRAND.gray400} fontSize={isOverall ? 26 : gaugeSize * 0.1} fontFamily="'DM Sans', sans-serif">
          out of 100
        </text>
      </svg>
      {label && (
        <div style={{ color: BRAND.gray300, fontSize: isOverall ? 20 : 14, fontWeight: isOverall ? 600 : 500, marginTop: 4, lineHeight: 1.35, fontFamily: "'DM Sans', sans-serif", padding: "0 4px", minHeight: isOverall ? "auto" : 36, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          {label}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div style={{ width: "100%", padding: "0 0 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.gray400 }}>
        <span>Question {current + 1} of {total}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div style={{ width: "100%", height: 4, background: BRAND.navyLight, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.blueBright})`, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}


function LogoMark({ size = "default", showName = true }) {
  const h = size === "large" ? 32 : 22;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size === "large" ? 12 : 8 }}>
      <img src={ANVIL_URL} alt="Telchar AI" style={{ height: h }} />
      {showName && (
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: size === "large" ? 22 : 15, color: BRAND.white, letterSpacing: "0.08em", textTransform: "uppercase" }}>TELCHAR AI</span>
      )}
    </div>
  );
}

function LandingPage({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(170deg, ${BRAND.navyDeep} 0%, ${BRAND.navy} 50%, #1e3248 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(${BRAND.navyLight}20 1px, transparent 1px), linear-gradient(90deg, ${BRAND.navyLight}20 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4 }} />
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${BRAND.blue}08 0%, transparent 70%)` }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease" }}>
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "center" }}>
          <LogoMark size="large" />
        </div>

        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, color: BRAND.white, lineHeight: 1.2, marginBottom: 20 }}>
          AI Readiness Assessment
        </h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2.5vw, 19px)", color: BRAND.gray300, lineHeight: 1.7, marginBottom: 12, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
          Find out where AI can make the biggest impact on your business. Answer a few questions about how you operate today and get a personalized scorecard with specific recommendations.
        </p>

        <div style={{ maxWidth: 560, marginLeft: "auto", marginRight: "auto", marginBottom: 36, padding: "16px 24px", background: BRAND.blueGlow, borderRadius: 8, border: `1px solid ${BRAND.blue}30` }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: BRAND.gray200, lineHeight: 1.65, margin: 0 }}>
            Most AI assessments are built for enterprise companies with massive budgets and dedicated IT teams. This one is built for you. We help small and mid-size businesses cut through the noise, separate real value from hype, and find the AI opportunities that actually make sense for your operation.
          </p>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: BRAND.gray400, marginBottom: 32 }}>
          Takes about 4 minutes. Free. Confidential.
        </p>

        <button onClick={onStart} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600, padding: "16px 48px", background: BRAND.blue, color: BRAND.white, border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease", letterSpacing: "0.02em" }}
          onMouseOver={(e) => { e.target.style.background = BRAND.blueBright; e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 8px 24px ${BRAND.blue}40`; }}
          onMouseOut={(e) => { e.target.style.background = BRAND.blue; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
        >
          Start Your Assessment
        </button>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {[{ num: "17", text: "Questions" }, { num: "5", text: "AI Categories Scored" }, { num: "100%", text: "Confidential" }].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: BRAND.blue }}>{item.num}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.gray400, marginTop: 2 }}>{item.text}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: "16px 24px", background: BRAND.navyLight + "60", borderRadius: 8, border: `1px solid ${BRAND.navyLight}` }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.gray400, lineHeight: 1.6, margin: 0 }}>
            Your responses are confidential. We do not sell, share, or use your data for any purpose beyond delivering your assessment and improving our services.
          </p>
        </div>
      </div>
    </div>
  );
}

function AssessmentFlow({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const emailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com", "msn.com", "live.com", "protonmail.com", "comcast.net", "att.net", "sbcglobal.net", "verizon.net", "cox.net", "charter.net", "earthlink.net", "mac.com", "me.com"];
  const [fadeState, setFadeState] = useState("in");
  const [advancing, setAdvancing] = useState(false);
  const timerRef = useRef(null);

  const question = QUESTIONS[currentIndex];
  const currentAnswer = answers[question.id];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const validate = () => {
    if (!question.required) return true;
    if (question.type === "multiselect") return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    if (question.type === "email") { const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/; const commonTlds = ["com","net","org","edu","gov","io","co","ai","us","uk","ca","de","fr","es","it","nl","au","in","jp","biz","info","me","tv","app","dev","tech","xyz","site","online","store","pro","mil"]; if (!currentAnswer || !re.test(currentAnswer)) return false; const tld = currentAnswer.split(".").pop().toLowerCase(); return commonTlds.includes(tld); }
    if (question.id === "company_name") { const val = (currentAnswer || "").trim(); if (val.length < 4) return false; if (/^(.)\1+$/.test(val.replace(/\s/g, ""))) return false; const words = val.split(/\s+/); if (words.some(w => /^(.)\1+$/i.test(w))) return false; if (words.length > 1 && words.every(w => w.toLowerCase() === words[0].toLowerCase())) return false; return true; }
    if (question.id === "contact_name") { const words = (currentAnswer || "").trim().split(/\s+/).filter(w => w.length > 0); if (words.length < 2 || !words.every(w => w.length >= 2)) return false; if (words.every(w => w.toLowerCase() === words[0].toLowerCase())) return false; if (words.some(w => /^(.)\1+$/i.test(w))) return false; return true; }
    if (question.id === "industry" && currentAnswer === "Other") return otherText.trim().length > 0;
    return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "";
  };

  const getErrorMessage = () => {
    if (question.type === "email") return "Please enter a valid email address";
    if (question.id === "company_name") return "Please enter your full company name";
    if (question.id === "contact_name") return "Please enter your first and last name";
    return "Please answer this question to continue";
  };

  const animateTo = (newIndex) => {
    clearTimers();
    setAdvancing(false);
    setFadeState("out");
    timerRef.current = setTimeout(() => {
      setCurrentIndex(newIndex);
      setFadeState("in");
      timerRef.current = null;
    }, 250);
  };

  const handleNext = () => {
    if (!validate()) {
      setError(getErrorMessage());
      return;
    }
    setError("");
    if (question.id === "industry" && currentAnswer === "Other") setAnswers((prev) => ({ ...prev, industry: `Other: ${otherText}` }));
    if (isLastQuestion) {
      const finalAnswers = { ...answers };
      if (QUESTIONS[currentIndex].id === "industry" && answers.industry === "Other") finalAnswers.industry = `Other: ${otherText}`;
      onComplete(finalAnswers);
      return;
    }
    animateTo(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setError("");
    clearTimers();
    setAdvancing(false);
    setFadeState("out");
    timerRef.current = setTimeout(() => {
      setCurrentIndex((i) => Math.max(0, i - 1));
      setFadeState("in");
      timerRef.current = null;
    }, 200);
  };

  const handleSelectOption = (option) => {
    setError("");
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
    if (question.autoAdvance && option !== "Other") {
      setAdvancing(true);
      timerRef.current = setTimeout(() => {
        if (currentIndex === QUESTIONS.length - 1) {
          onComplete({ ...answers, [question.id]: option });
        } else {
          animateTo(currentIndex + 1);
        }
      }, 350);
    }
  };

  const handleMultiSelect = (option) => {
    setError("");
    const current = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    if (current.includes(option)) setAnswers((prev) => ({ ...prev, [question.id]: current.filter((o) => o !== option) }));
    else setAnswers((prev) => ({ ...prev, [question.id]: [...current, option] }));
  };

  const handleKeyPress = (e) => { if (e.key === "Enter" && question.type !== "textarea") handleNext(); };

  const showContinueButton = question.type === "text" || question.type === "email" || question.type === "textarea" || question.type === "multiselect" || (question.hasOther && currentAnswer === "Other");

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(170deg, ${BRAND.navyDeep} 0%, ${BRAND.navy} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }} onKeyDown={handleKeyPress}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ marginBottom: 32 }}>
          <LogoMark />
        </div>

        <ProgressBar current={currentIndex} total={QUESTIONS.length} />

        {question.sectionTitle && (
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: BRAND.blue, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Section {question.section}: {question.sectionTitle}
          </div>
        )}

        <div style={{ opacity: fadeState === "in" ? 1 : 0, transform: fadeState === "in" ? "translateY(0)" : "translateY(8px)", transition: "all 0.25s ease" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 600, color: BRAND.white, lineHeight: 1.4, marginBottom: 28 }}>
            {question.label}
          </h2>

          {(question.type === "text" || question.type === "email") && (
            <div style={{ position: "relative", width: "100%" }}>
              <input type={question.type === "email" ? "text" : question.type} value={currentAnswer || ""} onChange={(e) => { setError(""); const val = e.target.value; setAnswers((prev) => ({ ...prev, [question.id]: val })); if (question.type === "email" && val.includes("@") && !val.includes("@.") && val.split("@")[1] !== undefined && !val.split("@")[1].includes(".")) { setShowEmailSuggestions(true); } else { setShowEmailSuggestions(false); } }} placeholder={question.placeholder} autoFocus autoComplete="off"
                style={{ width: "100%", padding: "14px 18px", fontSize: 17, fontFamily: "'DM Sans', sans-serif", background: BRAND.navyLight, border: `1px solid ${error ? BRAND.red : BRAND.navyLight}`, borderRadius: 8, color: BRAND.white, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={(e) => { if (!error) e.target.style.borderColor = BRAND.blue; }}
                onBlur={(e) => { if (!error) e.target.style.borderColor = BRAND.navyLight; setTimeout(() => setShowEmailSuggestions(false), 200); }}
                onKeyDown={(e) => { if (e.key === "Enter" && question.type !== "textarea") handleNext(); }}
              />
              {question.type === "email" && showEmailSuggestions && currentAnswer && currentAnswer.includes("@") && (() => {
                const prefix = currentAnswer.split("@")[0];
                const typed = currentAnswer.split("@")[1] || "";
                const filtered = emailDomains.filter(d => d.startsWith(typed.toLowerCase()));
                if (filtered.length === 0) return null;
                return (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: BRAND.navy, border: `1px solid ${BRAND.navyLight}`, borderRadius: 8, marginTop: 4, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                    {filtered.map((domain) => (
                      <button key={domain} onMouseDown={(e) => { e.preventDefault(); setAnswers((prev) => ({ ...prev, [question.id]: `${prefix}@${domain}` })); setShowEmailSuggestions(false); }}
                        style={{ width: "100%", padding: "12px 18px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", background: "transparent", border: "none", color: BRAND.gray300, cursor: "pointer", textAlign: "left", display: "block" }}
                        onMouseOver={(e) => { e.target.style.background = BRAND.navyLight; }}
                        onMouseOut={(e) => { e.target.style.background = "transparent"; }}
                      >
                        {prefix}@{domain}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {question.type === "textarea" && (
            <textarea value={currentAnswer || ""} onChange={(e) => { setError(""); setAnswers((prev) => ({ ...prev, [question.id]: e.target.value })); }} placeholder={question.placeholder} rows={4}
              style={{ width: "100%", padding: "14px 18px", fontSize: 17, fontFamily: "'DM Sans', sans-serif", background: BRAND.navyLight, border: `1px solid ${BRAND.navyLight}`, borderRadius: 8, color: BRAND.white, outline: "none", resize: "vertical", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = BRAND.blue)}
              onBlur={(e) => (e.target.style.borderColor = BRAND.navyLight)}
            />
          )}

          {question.type === "select" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {question.options.map((option, idx) => {
                const isSelected = currentAnswer === option;
                return (
                  <button key={idx} onClick={() => handleSelectOption(option)} disabled={advancing}
                    style={{ width: "100%", padding: "14px 18px", fontSize: 16, fontFamily: "'DM Sans', sans-serif", background: isSelected ? BRAND.blueGlow : BRAND.navyLight, border: `1px solid ${isSelected ? BRAND.blue : BRAND.navyLight}`, borderRadius: 8, color: isSelected ? BRAND.white : BRAND.gray300, cursor: advancing ? "default" : "pointer", textAlign: "left", transition: "all 0.15s ease", opacity: advancing && !isSelected ? 0.5 : 1 }}
                    onMouseOver={(e) => { if (!isSelected && !advancing) e.target.style.borderColor = BRAND.gray500; }}
                    onMouseOut={(e) => { if (!isSelected) e.target.style.borderColor = BRAND.navyLight; }}
                  >
                    {option}
                  </button>
                );
              })}
              {question.hasOther && currentAnswer === "Other" && (
                <input type="text" value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="Please specify your industry" autoFocus
                  style={{ width: "100%", padding: "14px 18px", fontSize: 16, fontFamily: "'DM Sans', sans-serif", background: BRAND.navyLight, border: `1px solid ${BRAND.blue}`, borderRadius: 8, color: BRAND.white, outline: "none", marginTop: 4, boxSizing: "border-box" }}
                />
              )}
            </div>
          )}

          {question.type === "multiselect" && (
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.gray400, marginBottom: 12, marginTop: 0 }}>Select all that apply</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {question.options.map((option, idx) => {
                  const selected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                  return (
                    <button key={idx} onClick={() => handleMultiSelect(option)}
                      style={{ width: "100%", padding: "14px 18px", fontSize: 16, fontFamily: "'DM Sans', sans-serif", background: selected ? BRAND.blueGlow : BRAND.navyLight, border: `1px solid ${selected ? BRAND.blue : BRAND.navyLight}`, borderRadius: 8, color: selected ? BRAND.white : BRAND.gray300, cursor: "pointer", textAlign: "left", transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 12 }}
                      onMouseOver={(e) => { if (!selected) e.currentTarget.style.borderColor = BRAND.gray500; }}
                      onMouseOut={(e) => { if (!selected) e.currentTarget.style.borderColor = BRAND.navyLight; }}
                    >
                      <span style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${selected ? BRAND.blue : BRAND.gray500}`, background: selected ? BRAND.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: BRAND.white }}>
                        {selected ? "✓" : ""}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.red, marginTop: 12 }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 16 }}>
            <button onClick={handleBack} disabled={currentIndex === 0}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, padding: "12px 24px", background: "transparent", border: `1px solid ${currentIndex === 0 ? BRAND.navyLight : BRAND.gray500}`, borderRadius: 8, color: currentIndex === 0 ? BRAND.gray500 : BRAND.gray300, cursor: currentIndex === 0 ? "default" : "pointer", transition: "all 0.15s ease" }}>
              Back
            </button>
            {showContinueButton && (
              <button onClick={handleNext}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, padding: "12px 32px", background: BRAND.blue, border: "none", borderRadius: 8, color: BRAND.white, cursor: "pointer", transition: "all 0.15s ease" }}
                onMouseOver={(e) => { e.target.style.background = BRAND.blueBright; }}
                onMouseOut={(e) => { e.target.style.background = BRAND.blue; }}
              >
                {isLastQuestion ? "See My Results" : "Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickWinsChart({ quickWins }) {
  const [selected, setSelected] = useState(null);
  
  // Assign impact scores for bar widths (first = highest impact)
  const maxImpact = quickWins.length;
  const items = quickWins.map((win, i) => ({
    ...win,
    impact: maxImpact - i,
    pct: Math.round(((maxImpact - i) / maxImpact) * 100)
  }));

  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: BRAND.white, marginBottom: 8 }}>Where to Start</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.gray400, marginBottom: 24, lineHeight: 1.5 }}>Ranked by impact. Click any bar for details.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((win, i) => (
          <div key={i} onClick={() => setSelected(selected === i ? null : i)} style={{ cursor: "pointer", transition: "all 0.15s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: BRAND.white, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{win.title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: BRAND.gray400, flexShrink: 0 }}>{win.category}</div>
            </div>
            <div style={{ position: "relative", height: 28, background: BRAND.navyLight, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${Math.max(win.pct, 25)}%`, background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.blueBright})`, borderRadius: 6, transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)", transitionDelay: `${i * 0.1}s`, opacity: selected === i ? 1 : 0.8 }} />
              <div style={{ position: "absolute", top: 0, left: 0, height: "100%", display: "flex", alignItems: "center", paddingLeft: 12 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BRAND.white, opacity: 0.9 }}>#{i + 1} Priority</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div style={{ marginTop: 12, background: BRAND.navyLight, borderRadius: 12, padding: "24px 24px", border: `1px solid ${BRAND.blue}30`, position: "relative" }}>
          <button onClick={() => setSelected(null)} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: BRAND.gray400, fontSize: 18, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>{"\u2715"}</button>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: BRAND.blue, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{items[selected].category}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: BRAND.white, marginBottom: 4, paddingRight: 28 }}>{items[selected].title}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BRAND.gold, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>#{selected + 1} Priority</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.gray300, lineHeight: 1.7 }}>{items[selected].desc}</div>
        </div>
      )}
    </div>
  );
}

function ReportSection({ section, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <div style={{ background: BRAND.navyLight + "60", borderRadius: 12, border: `1px solid ${section.isHighImpact ? BRAND.blue + "60" : BRAND.navyLight}`, overflow: "hidden", transition: "all 0.2s ease" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "18px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: BRAND.blue, textTransform: "uppercase", letterSpacing: "0.06em" }}>{section.category}</span>
            {section.isHighImpact && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: BRAND.navyDeep, background: BRAND.gold, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Highest Impact</span>}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: BRAND.white }}>{section.title}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.gray500, marginTop: 2 }}>Your answer: {section.answer}</div>
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, color: BRAND.gray400, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", flexShrink: 0 }}>
          {"\u25BE"}
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${BRAND.navyLight}` }}>
          <div style={{ paddingTop: 20, marginBottom: 16 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BRAND.gold, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>What This Tells Us</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.gray300, lineHeight: 1.65 }}>{section.interpretation}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BRAND.gold, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>What Leading Companies Are Doing</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.gray300, lineHeight: 1.65 }}>{section.benchmark}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BRAND.gold, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Your Opportunity</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.gray300, lineHeight: 1.65 }}>{section.opportunity}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsPage({ answers, scores, quickWins }) {
  const [visible, setVisible] = useState(false);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  useEffect(() => { const t = setTimeout(() => setShowBar(true), 3000); return () => clearTimeout(t); }, []);

  const getScoreLabel = (s) => {
    if (s < 30) return "Getting Started";
    if (s < 50) return "Early Stage";
    if (s < 70) return "Building Momentum";
    if (s < 85) return "Well Positioned";
    return "AI Ready";
  };

  const categoryOrder = ["operations", "sales", "data", "content", "technology"];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(170deg, ${BRAND.navyDeep} 0%, ${BRAND.navy} 100%)`, padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
            <LogoMark />
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: BRAND.white, marginBottom: 8 }}>Telchar AI Readiness Index<sup style={{ fontSize: "0.45em", verticalAlign: "super", opacity: 0.7 }}>{"\u2122"}</sup></h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: BRAND.gray400 }}>{answers.company_name}{answers.industry ? ` \u00B7 ${answers.industry}` : ""}</p>
        </div>

        <div style={{ background: BRAND.navyLight + "80", borderRadius: 20, padding: "56px 32px 48px", textAlign: "center", marginBottom: 36, border: `1px solid ${BRAND.navyLight}`, overflow: "hidden" }}>
          <Gauge score={scores.overall} size={240} isOverall />
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 600, color: BRAND.white, marginTop: 20 }}>{getScoreLabel(scores.overall)}</div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: BRAND.gray400, marginTop: 14, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            {scores.overall < 40 ? "Your business has significant opportunity to benefit from AI. Most of your operations are running on manual effort, which means the upside is substantial." : scores.overall < 65 ? "You have some systems in place, but there are clear areas where AI can reduce cost, save time, and improve how you operate day to day." : scores.overall < 85 ? "Your business has solid foundations. There are targeted areas where AI can optimize what's already working and unlock the next level of efficiency." : "Your business is well ahead of the curve. Fine-tuned AI integrations can help you scale and maintain your competitive edge."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 48 }}>
          {categoryOrder.map((key) => {
            const cat = scores.categories[key];
            if (!cat) return null;
            return (
              <div key={key} style={{ background: BRAND.navyLight + "80", borderRadius: 14, padding: "28px 12px 28px", textAlign: "center", border: `1px solid ${BRAND.navyLight}`, display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
                <Gauge score={cat.score} size={195} label={cat.label} />
              </div>
            );
          })}
        </div>

        <QuickWinsChart quickWins={quickWins} />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: BRAND.white, marginBottom: 8 }}>Your Full AI Readiness Report</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.gray400, marginBottom: 20, lineHeight: 1.5 }}>Ranked by impact. Your weakest areas appear first. Click any section to expand the full analysis.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {generatePDFContent(answers, scores, quickWins).map((section, i) => (
              <ReportSection key={i} section={section} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {(() => { const cta = getDynamicCTA(scores.overall); return (
        <div style={{ background: `linear-gradient(135deg, ${BRAND.navyLight}, ${BRAND.navy})`, borderRadius: 16, padding: "40px 32px", textAlign: "center", border: `1px solid ${BRAND.blue}30`, marginBottom: 32 }}>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: BRAND.white, marginBottom: 12, marginTop: 0 }}>{cta.heading}</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: BRAND.gray400, marginBottom: 24, lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{cta.desc}</p>
          <button onClick={() => { alert("In production: opens your calendar booking link."); }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, padding: "14px 40px", background: BRAND.blue, color: BRAND.white, border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseOver={(e) => { e.target.style.background = BRAND.blueBright; e.target.style.boxShadow = `0 8px 24px ${BRAND.blue}40`; }}
            onMouseOut={(e) => { e.target.style.background = BRAND.blue; e.target.style.boxShadow = "none"; }}
          >
            Schedule a Free Consultation
          </button>
        </div>
        ); })()}

        <div style={{ marginTop: 32, textAlign: "center", paddingBottom: 80 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: BRAND.gray500, lineHeight: 1.5 }}>Your responses are confidential. We do not sell, share, or use your data for any purpose beyond delivering your assessment.</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: BRAND.gray500, marginTop: 8 }}>The Telchar AI Readiness Index{"\u2122"} and its scoring methodology are proprietary to Telchar AI.</p>
        </div>
      </div>

      {showBar && (() => { const cta = getDynamicCTA(scores.overall); return (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 900, background: `linear-gradient(180deg, transparent 0%, ${BRAND.navyDeep}ee 20%, ${BRAND.navyDeep} 100%)`, padding: "24px 20px 20px", transform: showBar ? "translateY(0)" : "translateY(100%)", transition: "transform 0.4s ease", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: 600, width: "100%", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: BRAND.white }}>{cta.heading}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.gray400 }}>Free 30 min consultation. No obligation.</div>
            </div>
            <button onClick={() => { alert("In production: opens your calendar booking link."); }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, padding: "12px 24px", background: BRAND.blue, color: BRAND.white, border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap", flexShrink: 0 }}
              onMouseOver={(e) => { e.target.style.background = BRAND.blueBright; e.target.style.boxShadow = `0 4px 16px ${BRAND.blue}40`; }}
              onMouseOut={(e) => { e.target.style.background = BRAND.blue; e.target.style.boxShadow = "none"; }}
            >
              Book a Call
            </button>
          </div>
        </div>
      ); })()}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [answers, setAnswers] = useState(null);
  const [scores, setScores] = useState(null);
  const [quickWins, setQuickWins] = useState(null);
  const [leadQuality, setLeadQuality] = useState(null);

  const handleComplete = (finalAnswers) => {
    const calculatedScores = calculateScores(finalAnswers);
    const wins = generateQuickWins(finalAnswers, calculatedScores.categories);
    const lead = calculateLeadQuality(finalAnswers);
    setAnswers(finalAnswers);
    setScores(calculatedScores);
    setQuickWins(wins);
    setLeadQuality(lead);
    console.log("=== SUBMISSION DATA ===");
    console.log("Answers:", finalAnswers);
    console.log("Scores:", calculatedScores);
    console.log("Lead Quality:", lead);
    setPage("results");
    window.scrollTo(0, 0);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Rajdhani:wght@500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${BRAND.navyDeep}; }
        ::selection { background: ${BRAND.blue}40; }
        input::placeholder, textarea::placeholder { color: ${BRAND.gray500}; }
      `}</style>
      {page === "landing" && <LandingPage onStart={() => setPage("assessment")} />}
      {page === "assessment" && <AssessmentFlow onComplete={handleComplete} />}
      {page === "results" && answers && scores && <ResultsPage answers={answers} scores={scores} quickWins={quickWins} />}
    </>
  );
}
