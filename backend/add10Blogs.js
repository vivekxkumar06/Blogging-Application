const path = require("path");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const Blog = require("./models/Blog");

const blogsData = [
  {
    title: "Mastering React 19: Actions, useOptimistic, and Server Components in Practice",
    excerpt: "Explore the new era of React with Server Actions, useOptimistic, useFormStatus, and seamless asynchronous state handling.",
    content: `<h2>The Paradigm Shift in React 19</h2>
<p>React 19 marks a fundamental transformation in how developers handle asynchronous workflows, form submissions, and data mutations. By introducing first-class support for Actions and optimistic updates, React removes mountains of boilerplate.</p>
<h3>1. React Actions and useActionState</h3>
<p>Actions automatically manage pending states, optimistic updates, and error handling during form submissions without manual useState toggles.</p>
<h3>2. Instant Feedback with useOptimistic</h3>
<p>Users expect immediate feedback. With useOptimistic, interfaces display predicted state instantly while background network requests resolve.</p>
<blockquote>"The best user experiences feel instantaneous. React 19 makes optimistic state management a first-class citizen."</blockquote>`,
    categoryName: "Web Development",
    tags: ["React", "JavaScript", "Frontend", "WebDev"],
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    title: "Next-Gen API Architecture: REST vs GraphQL vs gRPC in 2026",
    excerpt: "A comprehensive breakdown of modern API protocols, their performance benchmarks, payload sizes, and ideal production use cases.",
    content: `<h2>Choosing the Right Communication Protocol</h2>
<p>In modern microservices and full-stack architectures, one size does not fit all. REST remains reliable for public consumption, GraphQL excels for complex UI client aggregation, and gRPC dominates internal microservice performance.</p>
<h3>Protocol Comparison</h3>
<ul>
  <li><strong>REST:</strong> Ubiquitous, standard HTTP semantics, effortlessly cacheable via CDN edges.</li>
  <li><strong>GraphQL:</strong> Single endpoint, precise client-driven queries, eliminates over-fetching.</li>
  <li><strong>gRPC:</strong> Protocol Buffers, multiplexed HTTP/2, ultra-low latency for distributed backends.</li>
</ul>`,
    categoryName: "Web Development",
    tags: ["API", "GraphQL", "Backend", "Architecture"],
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
  {
    title: "Building Autonomous AI Coding Agents with Tool Calling and Verification",
    excerpt: "Understand the core architecture behind AI agents: reasoning loops, sandboxed execution, MCP protocols, and self-healing systems.",
    content: `<h2>The Rise of Agentic Architecture</h2>
<p>AI has progressed from simple text completion to autonomous software engineering agents capable of navigating large codebases, running build tests, and repairing bugs iteratively.</p>
<h3>The Core Execution Cycle</h3>
<ol>
  <li><strong>Perception:</strong> Ingesting syntax trees, diagnostics, and environment state.</li>
  <li><strong>Planning:</strong> Breaking high-level requirements into verifiable atomic steps.</li>
  <li><strong>Tool Execution:</strong> Invoking compilers, git commands, and test runners safely.</li>
  <li><strong>Verification:</strong> Inspecting command exit codes and logs to guarantee correctness.</li>
</ol>`,
    categoryName: "Artificial Intelligence",
    tags: ["AI", "Agents", "LLM", "MachineLearning"],
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    title: "Fine-Tuning Open Source LLMs on Custom Datasets: A Practical Guide",
    excerpt: "Step-by-step instructions for fine-tuning modern open-source models using LoRA, QLoRA, and Unsloth on affordable GPU hardware.",
    content: `<h2>Why Fine-Tune in 2026?</h2>
<p>While prompting and RAG solve many tasks, domain-specific vocabularies, strict output formats, and latency-sensitive deployments require specialized lightweight models.</p>
<h3>Parameter-Efficient Fine-Tuning (PEFT)</h3>
<p>QLoRA allows 4-bit quantized base models to be adapted by training small rank decomposition matrices, drastically reducing GPU memory consumption from 80GB down to under 16GB.</p>`,
    categoryName: "Artificial Intelligence",
    tags: ["AI", "OpenSource", "DeepLearning", "Python"],
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
  {
    title: "Docker to Kubernetes: Production Deployment for Modern MERN Applications",
    excerpt: "Transition your containerized full-stack application into a resilient, auto-scaling Kubernetes cluster with ingress controllers and TLS.",
    content: `<h2>From Local Containers to Orchestration</h2>
<p>Containerizing with Docker ensures environmental parity between developer laptops and production servers. Kubernetes takes this further by providing self-healing, rolling deployments, and horizontal auto-scaling.</p>
<h3>Key Kubernetes Manifests</h3>
<ul>
  <li><strong>Deployments:</strong> Declarative state management for frontend and backend pods.</li>
  <li><strong>Services & Ingress:</strong> Internal load balancing and public route mapping with automated SSL via cert-manager.</li>
  <li><strong>ConfigMaps & Secrets:</strong> Decoupling configuration from application container images.</li>
</ul>`,
    categoryName: "Cloud & DevOps",
    tags: ["Docker", "Kubernetes", "DevOps", "MERN"],
    coverImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
  {
    title: "Mastering CI/CD with GitHub Actions: Automated Tests, Linting, and Docker Builds",
    excerpt: "Construct bulletproof deployment pipelines with GitHub Actions matrix builds, caching strategies, and semantic versioning.",
    content: `<h2>Automating the Software Delivery Lifecycle</h2>
<p>Reliable continuous integration stops broken builds from contaminating main branches. Learn how to configure parallel test jobs, Docker layer caching, and automated canary deployments.</p>
<h3>Pipeline Optimization Best Practices</h3>
<p>Leverage cache actions for npm dependencies and Docker layer buildx cache to reduce pull request build times from 12 minutes to under 90 seconds.</p>`,
    categoryName: "Cloud & DevOps",
    tags: ["DevOps", "GitHubActions", "CICD", "Automation"],
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
  {
    title: "Modern CSS in 2026: Container Queries, Subgrid, and Native Nesting",
    excerpt: "Discover how modern browser capabilities replace heavyweight JavaScript UI workarounds with native CSS standards.",
    content: `<h2>The Renaissance of Pure CSS</h2>
<p>CSS has evolved faster over the last three years than in the previous decade. Features that once required JavaScript event listeners or CSS preprocessors are now fully supported across all major evergreen browsers.</p>
<h3>1. Container Queries (@container)</h3>
<p>Style components based on their parent container's width rather than the global viewport width, unlocking truly modular UI design.</p>
<h3>2. CSS Subgrid</h3>
<p>Nested grid items can now align directly with the tracks of parent grids, making complex card layouts trivial.</p>`,
    categoryName: "UI/UX & Design",
    tags: ["CSS", "WebDesign", "Frontend", "UIUX"],
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
  {
    title: "Crafting Micro-Interactions: Elevating Frontend Delight with Framer Motion",
    excerpt: "Learn how subtle hover effects, layout animations, and spring physics turn functional web apps into memorable digital products.",
    content: `<h2>The Psychology of Micro-Interactions</h2>
<p>Micro-interactions provide immediate visual validation of user intent. When executed thoughtfully with spring physics rather than rigid linear easing, interfaces feel alive and tactile.</p>
<h3>Layout Animations with layoutId</h3>
<p>Framer Motion's layoutId allows elements to morph seamlessly between disparate component trees, such as tabs, floating modals, and expanding cards.</p>`,
    categoryName: "UI/UX & Design",
    tags: ["FramerMotion", "Animation", "UIUX", "React"],
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
  {
    title: "System Design Essentials: Redis Caching and High-Throughput Read Strategies",
    excerpt: "Prevent database bottlenecks with Cache-Aside, Write-Through caching patterns, Redis TTL invalidation, and connection pooling.",
    content: `<h2>Scaling Database Read Operations</h2>
<p>When user traffic spikes, relational and document databases quickly run out of connection limits and IOPS. Implementing a robust Redis caching layer protects primary persistence stores.</p>
<h3>Key Caching Patterns</h3>
<ul>
  <li><strong>Cache-Aside:</strong> Application checks cache first; on miss, queries DB and populates cache.</li>
  <li><strong>TTL & Invalidation:</strong> Setting appropriate expiration times and event-driven invalidation hooks on update mutations.</li>
</ul>`,
    categoryName: "Engineering Career",
    tags: ["SystemDesign", "Redis", "Backend", "Performance"],
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
  {
    title: "The Staff Engineer Roadmap: Technical Influence, System RFCs, and Mentorship",
    excerpt: "How senior software engineers scale their impact beyond individual code delivery to shape organizational architecture and culture.",
    content: `<h2>Beyond Senior: The Role of Staff Engineering</h2>
<p>Reaching staff level requires a mindset pivot from 'how fast can I build this feature?' to 'what systemic architectural patterns will prevent our team from hitting scalability cliffs next year?'</p>
<h3>Pillars of Impact</h3>
<ol>
  <li><strong>Writing Clear RFCs:</strong> Framing architectural dilemmas with clear trade-offs, security implications, and cost assessments.</li>
  <li><strong>Amplifying Others:</strong> Mentoring mid-level engineers through code reviews and pair debugging.</li>
  <li><strong>Systemic Simplification:</strong> Eliminating deprecated tech debt and consolidating redundant services.</li>
</ol>`,
    categoryName: "Engineering Career",
    tags: ["Career", "Leadership", "Mentorship", "Engineering"],
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    isFeatured: false,
  },
];

async function run() {
  try {
    await connectDB();
    console.log("Connected to MongoDB successfully!");

    // 1. Ensure an author user exists
    let author = await User.findOne({ role: "admin" });
    if (!author) {
      author = await User.findOne();
    }
    if (!author) {
      author = await User.create({
        name: "Admin Developer",
        email: "admin@buildnotes.dev",
        password: "AdminPassword123!",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        bio: "Full Stack Engineer & Tech Writer.",
      });
      console.log("Created default author user:", author.email);
    }

    // 2. Add blogs
    const addedBlogs = [];
    for (const b of blogsData) {
      // Find or create category
      let cat = await Category.findOne({ name: b.categoryName });
      if (!cat) {
        cat = await Category.create({
          name: b.categoryName,
          description: `${b.categoryName} articles and tutorials`,
          color: "#2563EB",
        });
      }

      // Check if blog with same title already exists
      let existing = await Blog.findOne({ title: b.title });
      if (!existing) {
        const newBlog = await Blog.create({
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          coverImage: b.coverImage,
          category: cat._id,
          tags: b.tags,
          author: author._id,
          status: "published",
          isFeatured: b.isFeatured,
          views: Math.floor(Math.random() * 500) + 100,
        });
        addedBlogs.push(newBlog);
        console.log(`+ Added: "${newBlog.title}" (Category: ${b.categoryName})`);
      } else {
        console.log(`= Already exists: "${b.title}"`);
        addedBlogs.push(existing);
      }
    }

    console.log("\n==========================================");
    console.log(`Successfully verified/inserted ${addedBlogs.length} blogs into MongoDB!`);
    console.log("==========================================");
    process.exit(0);
  } catch (err) {
    console.error("Error adding blogs:", err);
    process.exit(1);
  }
}

run();
