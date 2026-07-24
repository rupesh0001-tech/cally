export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  twitter?: string;
  github?: string;
}

export type BlogCategory = "Productivity" | "Engineering" | "Workplace" | "Growth";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // HTML or Markdown formatted content
  category: BlogCategory;
  tags: string[];
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  author: Author;
  coverImage: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export const AUTHORS: Record<string, Author> = {
  alex: {
    name: "Alex Rivera",
    role: "Head of Product & Developer Relations at Cally",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    bio: "Alex leads product growth and open-source architecture at Cally. Passionate about productivity systems, async work, and developer tools.",
    twitter: "alexrivera_tech",
    github: "arivera-dev",
  },
  sarah: {
    name: "Sarah Chen",
    role: "Senior Engineering Lead",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
    bio: "Sarah specializes in distributed calendar syncing algorithms, OAuth security, and high-performance Web APIs.",
    twitter: "sarahchen_codes",
    github: "schen-dev",
  },
  marcus: {
    name: "Marcus Vance",
    role: "Growth & Sales Operations Specialist",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    bio: "Marcus helps remote teams and fast-growing startups optimize their inbound scheduling workflows and meeting conversions.",
    twitter: "marcusvance_ops",
  },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "how-to-eliminate-back-and-forth-scheduling-emails",
    title: "The Ultimate Guide to Eliminating Back-and-Forth Scheduling Emails in 2026",
    subtitle: "Stop wasting hours negotiating meeting times. Learn how smart booking infrastructure transforms your daily workflow.",
    excerpt: "Negotiating meeting availability across time zones via email costs professionals an average of 4.5 hours every week. Discover how automated scheduling infrastructure eliminates friction and saves time.",
    category: "Productivity",
    tags: ["Scheduling", "Productivity", "Calendar Automation", "Workflow"],
    readTime: "5 min read",
    publishedAt: "2026-07-20",
    author: AUTHORS.alex,
    coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200",
    featured: true,
    seoTitle: "Eliminate Back-and-Forth Scheduling Emails in 2026 | Cally Blog",
    seoDescription: "Learn how to eliminate email back-and-forth when scheduling meetings. Discover automated booking links, time-zone syncing, and calendar infrastructure best practices.",
    keywords: [
      "eliminate scheduling emails",
      "calendar booking link",
      "stop back and forth emails",
      "automated scheduling tool",
      "cally scheduling guide",
    ],
    content: `
      <h2>The Hidden Cost of the "What Time Works for You?" Email Loop</h2>
      <p>
        We have all been there. You send an email suggesting three prospective times on Tuesday. The recipient replies stating Tuesday is packed, but offers Thursday morning. You reply that Thursday morning collides with a team sync... and suddenly, a single 30-minute meeting requires five email exchanges over two days.
      </p>
      <p>
        Research from productivity analysts indicates that knowledge workers spend over <strong>4.5 hours per week</strong> just negotiating calendars. That is almost an entire business day lost to administrative overhead every single week.
      </p>

      <h3>Why Traditional Scheduling is Broken</h3>
      <ul>
        <li><strong>Static Availability:</strong> Sending a bulleted list of open slots fails the moment your calendar changes 10 minutes later.</li>
        <li><strong>Timezone Confusion:</strong> Manual conversions between EST, PST, CET, and IST lead to missed meetings and awkward delays.</li>
        <li><strong>Context Switching:</strong> Switching tabs between email, Google Calendar, Outlook, and Zoom fragments focus.</li>
      </ul>

      <blockquote className="my-6 border-l-4 border-[#F3E75B] pl-4 italic text-[#2B2A27]">
        "Modern scheduling isn't just about picking a date—it's about preserving human energy for the conversations that actually matter."
      </blockquote>

      <h2>Step 1: Shift to Interactive Scheduling Links</h2>
      <p>
        Instead of offering static time slots, share a personalized, live-updating booking link (e.g., <code>cally.com/your-name/30min</code>).
        A modern scheduling infrastructure checks your Google, Outlook, and iCloud calendars in real-time, displaying <em>only</em> available windows to the booker.
      </p>

      <h3>Key Features to Look For in a Booking Platform</h3>
      <ol>
        <li><strong>Multi-Calendar Synchronization:</strong> Prevent double bookings across personal and work calendars simultaneously.</li>
        <li><strong>Customizable Buffer Times:</strong> Automatically inject 10–15 minute rest intervals before and after calls to prevent back-to-back burnout.</li>
        <li><strong>Automated Timezone Detection:</strong> The interface presents time slots in the booker's local timezone automatically.</li>
        <li><strong>Instant Video Integration:</strong> Generate Google Meet, Zoom, or Microsoft Teams conference links without manual paste work.</li>
      </ol>

      <h2>Step 2: Define Clear Booking Rules</h2>
      <p>
        To prevent calendar hijacking, establish sensible availability windows. For instance:
      </p>
      <ul>
        <li>Reserve mornings (9 AM - 12 PM) for deep focus work.</li>
        <li>Open meeting windows during afternoons (1 PM - 5 PM).</li>
        <li>Set a minimum notice window (e.g., at least 4 hours in advance) so unexpected meetings don't pop up instantly.</li>
      </ul>

      <h2>Conclusion: Reclaim Your Calendar Today</h2>
      <p>
        By adopting modern scheduling infrastructure like <strong>Cally</strong>, you transform calendar coordination from a tedious chore into a seamless, friction-free experience for both you and your guests.
      </p>
    `,
  },
  {
    id: "post-2",
    slug: "why-open-source-scheduling-is-the-future",
    title: "Why Open Source & Privacy-Focused Scheduling is the Future for Tech Teams",
    subtitle: "Why proprietary scheduling silos fall short on data privacy, custom workflows, and API flexibility.",
    excerpt: "Enterprise teams and developers are switching from closed SaaS platforms to open scheduling tools. Here is how open standards protect privacy and unlock customization.",
    category: "Engineering",
    tags: ["Open Source", "Data Privacy", "API", "Developer Tools", "Engineering"],
    readTime: "7 min read",
    publishedAt: "2026-07-18",
    author: AUTHORS.sarah,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
    featured: false,
    seoTitle: "Why Open Source Scheduling is the Future | Cally Engineering",
    seoDescription: "Discover why open-source and privacy-first scheduling infrastructure is superior for developers, enterprise security teams, and modern software companies.",
    keywords: [
      "open source scheduling",
      "calendly alternative open source",
      "privacy focused meeting software",
      "self hosted scheduling api",
      "calendar infrastructure",
    ],
    content: `
      <h2>The Rise of Open Scheduling Infrastructure</h2>
      <p>
        For years, scheduling software was treated as a monolithic, closed-source utility. Companies relied on third-party SaaS vendors to manage their team's calendars, availability rules, and client contact information.
      </p>
      <p>
        However, as data privacy regulations (GDPR, CCPA, HIPAA) tightened and developer needs evolved, closed silos began showing major drawbacks.
      </p>

      <h2>1. Complete Control Over Data & Privacy</h2>
      <p>
        When you send invitees to a third-party booking URL, you often hand over sensitive email addresses, calendar titles, participant details, and meeting notes to vendor servers.
      </p>
      <p>
        With an open scheduling platform like <strong>Cally</strong>, developers maintain strict ownership over their data layer, ensuring compliant storage and transparent data flow.
      </p>

      <h2>2. Deep Developer Extensibility</h2>
      <p>
        Proprietary platforms offer rigid UI templates. What if you need to:
      </p>
      <ul>
        <li>Embed booking widgets seamlessly into a custom React or Next.js app?</li>
        <li>Trigger complex Webhooks to internal CRM databases or Slack bots?</li>
        <li>Implement custom round-robin routing logic based on user tier or region?</li>
      </ul>
      <p>
        Open architecture gives engineers full access to clean REST APIs, Webhooks, and customizable frontend components.
      </p>

      <h2>3. No Vendor Lock-in or Sudden Paywalls</h2>
      <p>
        Closed platforms frequently lock essential features—like multi-calendar syncing or team routing—behind enterprise paywalls. Open scheduling guarantees freedom, scalability, and long-term security.
      </p>
    `,
  },
  {
    id: "post-3",
    slug: "10-time-management-hacks-for-developers",
    title: "10 Time Management Hacks for Developers and Product Managers",
    subtitle: "Protect maker time, eliminate context switching, and boost weekly output with proven calendar strategies.",
    excerpt: "Context switching kills developer momentum. Discover 10 actionable calendar hacks to safeguard focus blocks and streamline daily routines.",
    category: "Workplace",
    tags: ["Time Management", "Focus", "Developer Experience", "Productivity"],
    readTime: "6 min read",
    publishedAt: "2026-07-15",
    author: AUTHORS.alex,
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200",
    featured: false,
    seoTitle: "10 Time Management Hacks for Developers | Cally Blog",
    seoDescription: "Maximize focus time and protect developer flow state with these 10 calendar and time management hacks for modern software teams.",
    keywords: [
      "developer time management",
      "protect flow state",
      "maker schedule vs manager schedule",
      "calendar time blocking",
      "tech productivity tips",
    ],
    content: `
      <h2>The Maker vs. Manager Schedule Conflict</h2>
      <p>
        As Paul Graham famously pointed out, programmers and creators work on a <strong>Maker's Schedule</strong> (requiring uninterrupted 3 to 4 hour blocks), whereas executives operate on a <strong>Manager's Schedule</strong> (divided into 30-minute meeting units).
      </p>
      <p>
        A single 15-minute call scheduled right in the middle of a afternoon can destroy 3 hours of deep engineering flow.
      </p>

      <h2>10 Actionable Hacks to Guard Your Time</h2>
      <ol>
        <li><strong>Batch Meetings on Specific Days:</strong> Consolidate calls into Tuesday and Thursday afternoons, leaving Monday and Wednesday completely meeting-free.</li>
        <li><strong>Set Hard Buffer Windows:</strong> Enforce automatic 15-minute buffers before and after any call using automated tools like Cally.</li>
        <li><strong>Default to 20-Minute Meetings:</strong> Standard 30 and 60 minute defaults waste time. Use 20-minute slots to keep discussions focused and punchy.</li>
        <li><strong>Enforce Minimum Booking Notice:</strong> Require at least 6 to 12 hours notice so no unexpected meetings interrupt your current day's execution.</li>
        <li><strong>Color-Code Your Calendar:</strong> Visual hierarchy helps you immediately assess ratio of deep work vs collaboration.</li>
        <li><strong>Audit Recurring Meetings Monthly:</strong> If a recurring sync hasn't yielded actionable items in 3 weeks, transition it to asynchronous Slack updates.</li>
        <li><strong>Use Single-Purpose Event Types:</strong> Create specific booking links for "15-Min Quick Intro" vs "45-Min Technical Architecture Review".</li>
        <li><strong>Sync Personal & Work Calendars:</strong> Prevent doctor appointments or personal commitments from getting double-booked.</li>
        <li><strong>Set Maximum Daily Booking Limits:</strong> Cap incoming bookings at a maximum of 3 or 4 meetings per day.</li>
        <li><strong>Publish Clear Booking Rules:</strong> Share guidelines so clients and teammates know the best times for urgent syncs versus async messages.</li>
      </ol>
    `,
  },
  {
    id: "post-4",
    slug: "how-automated-calendar-syncing-boosts-conversion-rates",
    title: "How Automated Calendar Syncing Boosts Meeting Conversion Rates by 40%",
    subtitle: "Turn prospect interest into scheduled demos instantly by removing scheduling friction.",
    excerpt: "Speed to lead is everything in sales and consulting. Discover how instant calendar scheduling links double demo attendance and boost conversion.",
    category: "Growth",
    tags: ["Growth", "Sales", "Conversion Optimization", "Lead Generation"],
    readTime: "4 min read",
    publishedAt: "2026-07-10",
    author: AUTHORS.marcus,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    featured: false,
    seoTitle: "Boost Meeting Conversion Rates with Calendar Syncing | Cally",
    seoDescription: "Learn how instant calendar booking links increase meeting conversion rates by 40%. Reduce drop-off and streamline sales demo scheduling.",
    keywords: [
      "boost meeting conversions",
      "instant demo booking",
      "speed to lead scheduling",
      "sales calendar automation",
      "cally scheduling conversion",
    ],
    content: `
      <h2>The Critical Importance of 'Speed to Lead'</h2>
      <p>
        In modern sales, consulting, and recruitment, response latency directly dictates conversion rates. Studies demonstrate that reaching out to a lead within 5 minutes increases conversion likelihood by over <strong>300%</strong> compared to waiting an hour.
      </p>

      <h2>The Drop-Off Problem in Contact Forms</h2>
      <p>
        Traditional "Contact Us" forms ask users to submit their email and wait for a sales rep to reach out via email. By the time the rep sends suggestions, the prospect's intent has cooled down.
      </p>

      <h2>The Instant Booking Solution</h2>
      <p>
        By embedding a live <strong>Cally booking widget</strong> directly on your confirmation page, prospects can select a date and time immediately after submitting their inquiry.
      </p>
      <ul>
        <li><strong>40% Increase in Scheduled Demos:</strong> Eliminates back-and-forth email decay.</li>
        <li><strong>Reduced No-Shows:</strong> Automated calendar invites with Google Meet or Zoom details send instantly, accompanied by SMS/Email reminders.</li>
        <li><strong>Round-Robin Assignment:</strong> Automatically distribute incoming calls across team members based on real-time availability.</li>
      </ul>
    `,
  },
];

/**
 * Helper functions to query blog posts
 */
export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, category: BlogCategory, limit = 2): BlogPost[] {
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== currentSlug);
  const sameCategory = otherPosts.filter((p) => p.category === category);
  
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  
  return otherPosts.slice(0, limit);
}

export function getCategories(): BlogCategory[] {
  return ["Productivity", "Engineering", "Workplace", "Growth"];
}

export function searchPosts(query: string, categoryFilter?: string): BlogPost[] {
  let results = getAllPosts();
  
  if (categoryFilter && categoryFilter !== "All") {
    results = results.filter((p) => p.category === categoryFilter);
  }

  if (!query.trim()) {
    return results;
  }

  const q = query.toLowerCase();
  return results.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}
