require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const Blog = require("./models/Blog");
const Comment = require("./models/Comment");
const Bookmark = require("./models/Bookmark");
const Newsletter = require("./models/Newsletter");

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany();
    await Category.deleteMany();
    await Blog.deleteMany();
    await Comment.deleteMany();
    await Bookmark.deleteMany();
    await Newsletter.deleteMany();

    console.log("Seeding users...");
    // 1. Admin account
    const admin = await User.create({
      name: "Saurabh Sharma",
      email: "admin@buildnotes.dev",
      password: "AdminPassword123!",
      role: "admin",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Lead Software Architect & Tech Writer. Exploring high-scale distributed systems and full-stack engineering.",
      website: "https://buildnotes.dev",
      twitter: "https://twitter.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    });

    // 2. Author: Sarah Jenkins
    const author1 = await User.create({
      name: "Sarah Jenkins",
      email: "sarah@buildnotes.dev",
      password: "Password123!",
      role: "user",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      bio: "Senior Frontend Engineer & UI/UX Specialist. Passionate about design systems, React, and modern CSS architectures.",
      twitter: "https://twitter.com",
      github: "https://github.com",
    });

    // 3. Author: Alex Rivera
    const author2 = await User.create({
      name: "Alex Rivera",
      email: "alex@buildnotes.dev",
      password: "Password123!",
      role: "user",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "DevOps specialist & Cloud Infrastructure Engineer. Building reliable Kubernetes pipelines and serverless architectures.",
      twitter: "https://twitter.com",
      github: "https://github.com",
    });

    // Setup followers
    admin.followers.push(author1._id, author2._id);
    author1.followers.push(admin._id);
    author2.followers.push(admin._id);
    admin.following.push(author1._id);
    author1.following.push(admin._id);
    author2.following.push(admin._id);
    await admin.save();
    await author1.save();
    await author2.save();

    console.log("Seeding categories...");
    const catTech = await Category.create({
      name: "Web Development",
      description: "Frontend, backend, APIs, frameworks, and modern full-stack workflows.",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=80",
      color: "#2563EB",
    });

    const catAI = await Category.create({
      name: "Artificial Intelligence",
      description: "Large language models, generative AI, machine learning and agentic workflows.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
      color: "#7C3AED",
    });

    const catDesign = await Category.create({
      name: "UI/UX & Design",
      description: "Design systems, typography, micro-interactions, and user-centric psychology.",
      image:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
      color: "#EC4899",
    });

    const catCloud = await Category.create({
      name: "Cloud & DevOps",
      description: "Kubernetes, Docker, CI/CD pipelines, AWS, and serverless architectures.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
      color: "#059669",
    });

    const catCareer = await Category.create({
      name: "Engineering Career",
      description: "Technical interviews, leadership, remote work strategies, and productivity habits.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
      color: "#D97706",
    });

    console.log("Seeding blog posts...");
    const blog1 = await Blog.create({
      title: "Building Production-Ready Full Stack Applications in 2026: The Definitive Guide",
      excerpt:
        "A deep architectural dive into modern full-stack engineering with React, Node.js, microservices, state machines, and real-time synchronization.",
      content: `<h2>The Evolution of Modern Web Applications</h2>
<p>Modern full-stack web applications have evolved far beyond basic CRUD APIs and client-side rendering. Today's software systems require instant reactivity, optimistic state synchronization, offline resilience, and robust role-based security boundaries.</p>
<h3>Core Architectural Tenets</h3>
<p>When designing scalable web platforms, software architects consistently prioritize:</p>
<ul>
  <li><strong>Separation of Concerns:</strong> Clear delineation between presentation logic, application state, and domain persistence layers.</li>
  <li><strong>Defensive API Contracts:</strong> Schema validation both on ingress and egress, ensuring graceful error handling and zero data leakage.</li>
  <li><strong>Optimistic UI Updates:</strong> Immediate visual feedback paired with background retry routines.</li>
</ul>
<blockquote>"Software that feels fast is software that respects the user's focus. Latency masking and fluid state transitions define modern UX excellence."</blockquote>
<h3>Database Modeling and Indexing Strategy</h3>
<p>In high-throughput environments, MongoDB queries should always be supported by compound compound indexes. Always profile your slow operations using MongoDB's explain plan and monitor latency bottlenecks early in development.</p>`,
      coverImage:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
      category: catTech._id,
      tags: ["React", "NodeJS", "Architecture", "MongoDB", "FullStack"],
      author: admin._id,
      status: "published",
      isFeatured: true,
      views: 1420,
      likes: [author1._id, author2._id],
    });

    const blog2 = await Blog.create({
      title: "Architecting Micro-Frontends with React, Vite, and Module Federation",
      excerpt:
        "How large engineering organizations scale independent frontend teams without sacrificing bundle size, developer velocity, or visual consistency.",
      content: `<h2>Why Micro-Frontends Matter at Scale</h2>
<p>Monolithic frontend codebases frequently suffer from protracted build pipelines, cross-team merge conflicts, and release coordination bottlenecks. Micro-frontends decompose large frontends into independently deployable units.</p>
<h3>Vite and Native ESM Federation</h3>
<p>Vite's lightning-fast bundling paired with modern Module Federation enables micro-apps to share dependencies like React and Tailwind CSS dynamically at runtime, avoiding redundant network payloads.</p>
<p>By leveraging dynamic remote containers, teams achieve autonomous deployment cycles while maintaining a unified cohesive design system.</p>`,
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
      category: catTech._id,
      tags: ["React", "Vite", "MicroFrontends", "WebDev"],
      author: author1._id,
      status: "published",
      isFeatured: true,
      views: 980,
      likes: [admin._id],
    });

    const blog3 = await Blog.create({
      title: "The Rise of Autonomous AI Coding Agents: Paradigms, Tooling, and Safety",
      excerpt:
        "An analytical look at how LLM reasoning engines, subagent swarms, and tool calling protocols are reshaping the day-to-day work of software engineers.",
      content: `<h2>Beyond Autocomplete: The Age of Agentic Coding</h2>
<p>AI assistants have transitioned from simple single-line code completion to autonomous agentic loops capable of reading entire repositories, planning multi-step refactors, executing terminal commands, and verifying test suites.</p>
<h3>The Perception-Action Cycle</h3>
<p>An effective agent operates within a disciplined continuous feedback loop:</p>
<ol>
  <li><strong>Context Ingestion:</strong> Reading codebase symbols, dependencies, and git history.</li>
  <li><strong>Strategic Planning:</strong> Decomposing user goals into atomic, verifiable checkpoints.</li>
  <li><strong>Execution:</strong> Performing surgical file edits and executing local test commands.</li>
  <li><strong>Self-Correction:</strong> Detecting compiler warnings or runtime exceptions and rectifying them autonomously.</li>
</ol>`,
      coverImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      category: catAI._id,
      tags: ["AI", "MachineLearning", "Agents", "FutureOfWork"],
      author: admin._id,
      status: "published",
      isFeatured: false,
      views: 1870,
      likes: [author1._id, author2._id],
    });

    const blog4 = await Blog.create({
      title: "Mastering Design Systems: Building Tokens, Micro-Interactions, and Dark Mode",
      excerpt:
        "Discover how to construct an accessible, tokens-first design system in Tailwind CSS with fluid typography and seamless theme switching.",
      content: `<h2>The Philosophy of Design Tokens</h2>
<p>A design system is far more than a collection of buttons; it is a shared language between product designers and frontend engineers. Design tokens abstract raw values—such as hexadecimal colors and pixel dimensions—into semantic entities.</p>
<h3>Semantic Tokens vs Raw Values</h3>
<p>Instead of hardcoding colors, semantic tokens allow dynamic theming:</p>
<p>By mapping theme tokens to CSS custom properties, switching between light and dark modes requires only updating a root class, with zero layout recalculation overhead.</p>`,
      coverImage:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
      category: catDesign._id,
      tags: ["DesignSystems", "TailwindCSS", "UIUX", "CSS"],
      author: author1._id,
      status: "published",
      isFeatured: false,
      views: 820,
      likes: [admin._id],
    });

    const blog5 = await Blog.create({
      title: "Kubernetes in Production: Zero-Downtime Rolling Deploys and Observability",
      excerpt:
        "Step-by-step guidance on setting up resilient Kubernetes clusters, liveness/readiness probes, OpenTelemetry tracing, and auto-scaling.",
      content: `<h2>Zero-Downtime Deployments Explained</h2>
<p>In continuous deployment setups, terminating a pod prematurely results in dropped HTTP connections and 502 Bad Gateway responses. Configuring proper readiness probes and graceful shutdown handlers ensures seamless traffic redirection.</p>
<h3>Graceful Shutdown Strategy</h3>
<p>When Kubernetes sends a SIGTERM signal, your Express.js server should:</p>
<ul>
  <li>Stop accepting new incoming connections.</li>
  <li>Wait for in-flight requests to complete within a configured timeout.</li>
  <li>Close active database connection pools cleanly.</li>
</ul>`,
      coverImage:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      category: catCloud._id,
      tags: ["Kubernetes", "DevOps", "Docker", "Cloud"],
      author: author2._id,
      status: "published",
      isFeatured: false,
      views: 650,
      likes: [admin._id, author1._id],
    });

    const blog6 = await Blog.create({
      title: "From Junior to Staff Engineer: Navigating Technical Influence and Ownership",
      excerpt:
        "Actionable advice on broadening technical scope, writing effective RFCs, mentoring engineers, and steering cross-team architectural alignment.",
      content: `<h2>What Defines Senior and Staff Engineering?</h2>
<p>As you advance in your technical career, your value shifts from how many lines of code you write to how effectively you elevate the engineers around you and reduce system complexity.</p>
<h3>Key Pillars of Technical Leadership</h3>
<ol>
  <li><strong>Architectural RFCs:</strong> Articulating trade-offs, constraints, and alternative approaches before writing code.</li>
  <li><strong>Blameless Post-Mortems:</strong> Cultivating psychological safety and systemic root cause analysis during outages.</li>
  <li><strong>Force Multiplier Mindset:</strong> Building internal tools and libraries that accelerate the entire engineering organization.</li>
</ol>`,
      coverImage:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
      category: catCareer._id,
      tags: ["Career", "Leadership", "Mentorship", "Productivity"],
      author: admin._id,
      status: "published",
      isFeatured: false,
      views: 1150,
      likes: [author2._id],
    });

    console.log("Seeding comments...");
    await Comment.create({
      blog: blog1._id,
      user: author1._id,
      content:
        "Outstanding breakdown of optimistic state updates! We implemented this exact pattern last quarter and our user satisfaction scores improved dramatically.",
    });

    await Comment.create({
      blog: blog1._id,
      user: author2._id,
      content:
        "The defensive API contract segment is pure gold. Far too many applications ignore egress validation until production data gets corrupted.",
    });

    await Comment.create({
      blog: blog3._id,
      user: author1._id,
      content:
        "The perception-action cycle loop is spot on. Verification of test suites is what makes coding agents truly dependable.",
    });

    console.log("Seeding bookmarks...");
    await Bookmark.create({
      user: admin._id,
      blog: blog2._id,
    });
    await Bookmark.create({
      user: admin._id,
      blog: blog4._id,
    });
    await Bookmark.create({
      user: author1._id,
      blog: blog1._id,
    });

    console.log("Seeding newsletter subscribers...");
    await Newsletter.create({ email: "developer@example.com" });
    await Newsletter.create({ email: "architect@example.com" });

    console.log("-----------------------------------------");
    console.log("Database seeded successfully!");
    console.log("Demo Admin Credentials:");
    console.log("Email: admin@buildnotes.dev");
    console.log("Password: AdminPassword123!");
    console.log("-----------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
