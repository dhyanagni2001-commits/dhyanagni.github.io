// Portfolio content shown below the 3D intro. Images live in public/legacy/assets/images.

export type ProjectCategory = "ai" | "web" | "other";

export const projectCategories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI / ML" },
  { id: "web", label: "Web" },
  { id: "other", label: "Systems & Other" },
];

export const aboutParagraphs = [
  "I’m a software engineer and MS Computer Science student at USC, graduating in May 2027. Before grad school I spent a year at Happiest Minds building Profile and Flashcard microservices for ATI Testing, a platform with 500K+ users. That job taught me to care about what happens after the feature ships: latency, failures, and how services behave under load.",
  "Most of what I build sits where backend systems meet ML: job queues, CDC pipelines, retrieval services, and self-hosted LLM serving. I like measuring things properly, finding the actual bottleneck, and writing down the conditions behind every number.",
  "I’m looking for new-grad software engineering and applied ML roles starting in 2027.",
  "Outside of tech, you’ll usually find me on a tennis court or playing squash.",
];

export const services = [
  {
    title: "Backend Engineering",
    text: "I design APIs and microservices in Python with FastAPI and in C# with ASP.NET Core, backed by PostgreSQL and MySQL. At Happiest Minds I shipped Kafka-based event flows to production. In my own projects I’ve built API gateways, JWT authentication, and real-time chat over WebSockets.",
    icon: "icon-dev.svg",
  },
  {
    title: "Distributed Systems",
    text: "I build systems that keep working when parts of them fail. My PostgreSQL job queue handles 17,800 jobs per second with lease-based crash recovery tested in CI. I’ve also built a CDC pipeline that streams Postgres changes through Debezium and Kafka into Delta Lake, and a Redis-compatible key-value store in C++20.",
    icon: "icon-design.svg",
  },
  {
    title: "LLM Serving & Retrieval",
    text: "I build RAG services with LangGraph and FAISS and serve open models with self-hosted vLLM, benchmarking time-to-first-token and throughput under concurrent load. I evaluate retrieval on held-out queries instead of relying on demos, and I’ve built MCP servers that give AI agents structured tools.",
    icon: "icon-design.svg",
  },
  {
    title: "Infrastructure & Reliability",
    text: "I deploy services with Docker and Kubernetes and run tests in GitHub Actions CI on every push. I’ve worked with AWS services including SageMaker, Lambda, and Step Functions. For observability I use Prometheus and Grafana, and Datadog from my time debugging production issues at Happiest Minds.",
    icon: "icon-dev.svg",
  },
];

export const timelines: { title: string; items: { title: string; role?: string; period: string; text: string }[] }[] = [
  {
    title: "Education",
    items: [
      {
        title: "University of Southern California",
        period: "Aug 2025 – May 2027",
        text: "I’m pursuing a Master of Science in Computer Science at the USC Viterbi School of Engineering. My coursework includes Analysis of Algorithms, Machine Learning, Deep Learning, Agentic AI, Database Systems, and Applied NLP. My focus is on building ML systems that hold up in production, not just in notebooks.",
      },
      {
        title: "Visvesvaraya Technological University",
        period: "Aug 2019 – Aug 2023",
        text: "I earned my Bachelor of Engineering in Computer Science and Engineering from Malnad College of Engineering in Karnataka, India. During my degree I served as Technical Head of the Science Association and co-founded AWAKE, a student technical community. I also published a journal paper on a face-recognition attendance system.",
      },
    ],
  },
  {
    title: "Experience",
    items: [
      {
        title: "Happiest Minds Technologies",
        role: "Software Engineer",
        period: "May 2024 – Jul 2025",
        text: "I built Profile and Flashcard microservices using ASP.NET Core, Angular, MySQL, and Kafka for ATI Testing, a platform serving 500K+ users. I replaced synchronous profile updates triggered by flashcard progress with Kafka events, which raised completed updates per second by 150% in comparable load tests. I also tuned SQL queries and indexes based on execution-plan analysis, cutting average exam-report API latency by more than 200 ms. Beyond development, I containerized services with Docker, coordinated production deployments, and debugged customer-reported failures using Datadog logs and metrics.",
      },
      {
        title: "Bounce",
        role: "Data Science Intern (Data Engineering)",
        period: "Sep 2023 – Apr 2024",
        text: "I built Python and SQL ETL pipelines that processed more than 10 million ride and user activity records every day, adding validation and deduplication checks so downstream analytics could rely on the data. I cut the dashboard load time of a ride-demand analytics service by 35% by rewriting slow SQL queries and redesigning its relational schema. That gave the fleet operations team faster data for daily decisions.",
      },
      {
        title: "Coulomb AI (YC-backed)",
        role: "Data Science Intern (ML Engineering)",
        period: "Mar 2023 – Aug 2023",
        text: "I trained an XGBoost model to predict remaining useful life from more than 5 million battery telemetry records, reaching an R² of 0.87 in offline evaluation, and deployed it as an AWS SageMaker inference endpoint. I also built an Isolation Forest anomaly detector with per-battery dynamic thresholds. In offline tests it flagged 85% of known fault events while reducing false-positive alerts by 25%.",
      },
      {
        title: "Tequed Lab",
        period: "Aug 2022 - Sep 2022",
        text: "AI/ML Intern at Tequed Labs, where I built machine learning models using Python and Scikit-learn for sports performance prediction. Performed data analysis, feature engineering, and visualization to extract meaningful insights from real-world datasets.",
      },
      {
        title: "GRIDS",
        period: "Open-Source Contributor",
        text: "Contributed to an open-source Legal LLM project focused on applying language models to legal text and workflows. Worked collaboratively within an open-source development environment to build, test, and improve the project.",
      },
    ],
  },
  {
    title: "Leadership",
    items: [
      {
        title: "Technical Head · Science Association",
        period: "Aug 2019 – Aug 2023",
        text: "I led technical operations for SCIENTIA events with more than 400 attendees, handling audio-visual systems and fixing live issues during events. I built the association’s website and a Flutter-based online treasure hunt platform that increased participation. I also worked with other student leaders to plan and promote technical, academic, and cultural events.",
      },
      {
        title: "Founding Member · AWAKE",
        period: "Student Technical Community",
        text: "I helped start AWAKE, a student-led technical community focused on hands-on learning. We organized hackathons and practical workshops, and I taught sessions on Swift, Dart, and Flutter to help students build their first mobile apps.",
      },
    ],
  },
];

export const skills = [
  { label: "Languages", items: "Python, C++20, C#, TypeScript, JavaScript, SQL, Kotlin, Swift" },
  {
    label: "Backend & Distributed",
    items:
      "FastAPI, ASP.NET Core, Node.js/Express, REST APIs, SSE Streaming, WebSockets, Kafka, Debezium (CDC), Microservices, API Gateways, Job Queues",
  },
  {
    label: "AI / LLM Systems",
    items:
      "RAG, LangGraph, vLLM, FAISS, Sentence-Transformers, BM25, MCP Servers, Claude API, OpenAI API, Ollama, LLM Evaluation, TTFT/ITL Benchmarking",
  },
  {
    label: "Machine Learning",
    items: "PyTorch, Hugging Face Transformers, PyTorch Geometric, XGBoost, Scikit-learn, TensorFlow, YOLOv8, MLflow",
  },
  { label: "Edge & On-Device ML", items: "ONNX Runtime, Qualcomm AI Hub, Core ML, TFLite, WebAssembly" },
  {
    label: "Data Engineering",
    items: "PostgreSQL, Delta Lake, Databricks, PySpark, Airflow, DuckDB, Parquet, Tableau",
  },
  { label: "Databases", items: "PostgreSQL, MySQL, SQL Server, SQLite, Core Data" },
  {
    label: "Cloud & DevOps",
    items:
      "Docker, Kubernetes, GitHub Actions, AWS (SageMaker, Lambda, Step Functions, CloudWatch), Prometheus, Grafana, Datadog, Linux, Git",
  },
  {
    label: "Frontend & Mobile",
    items: "React, Redux, Angular, Vue, Three.js, Electron, Jetpack Compose, SwiftUI, Chrome Extensions",
  },
  { label: "Testing", items: "pytest, NUnit, Cypress, XCTest, Chaos and Crash-Recovery Testing" },
];

export const projects: {
  title: string;
  purpose: string;
  metric?: string;
  result?: string;
  stack: string[];
  category: ProjectCategory;
  url: string;
  image: string;
}[] = [
  {
    title: "First Fifty — Agentic Battery-Cell Triage",
    purpose:
      "Team of five Claude agents that pick which battery cells deserve a full life test after only 50 cycles, with human approval on every call and leakage-safe evaluation. Built for Hack-Nation × Databricks.",
    metric: "7–8 of 10",
    result: "Found 7–8 of the 10 longest-lived cells on a sealed batch.",
    stack: ["Claude agents", "Databricks", "Python"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/First_Fifty",
    image: "projects/first-fifty.svg",
  },
  {
    title: "RouteMCP — Self-Hosted LLM Gateway",
    purpose:
      "Routes OpenAI-compatible requests across providers using hard constraints and measured cost, quality, and latency, with confidence cascades, failover, and an MCP server.",
    metric: "77–88% lower cost",
    result: "On a 260-task eval it matched or beat always using gpt-4.1 at 77–88% lower cost.",
    stack: ["Python", "MCP", "SQLite"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/RouteMCP",
    image: "projects/routemcp.svg",
  },
  {
    title: "PayFlow — Real-Time Payments CDC Lakehouse",
    purpose:
      "Postgres → Debezium → Kafka → Parquet → Delta Lake (bronze/silver/gold) on Databricks, orchestrated by Airflow.",
    metric: "≥3.3K events/s",
    result: "Reconciled to the cent with zero loss across 12 chaos tests at ≥3.3K events/s.",
    stack: ["Kafka", "Debezium", "Delta Lake"],
    category: "other",
    url: "https://github.com/dhyanagni2001-commits/PayFlow",
    image: "projects/payflow.svg",
  },
  {
    title: "LLMForge — GPU Kernels for LLM Inference",
    purpose:
      "Fused residual-add + RMSNorm in CUDA C++, tiled causal attention in Triton, a vLLM custom op, and a TVM fusion pass, all validated against PyTorch references to answer one question: when does a faster kernel make a faster model response?",
    stack: ["CUDA", "Triton", "vLLM", "TVM"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/LLMForge",
    image: "projects/llmforge.svg",
  },
  {
    title: "FlashKV — Redis-Compatible Key-Value Store",
    purpose:
      "Event-driven, in-memory key-value database written from scratch in C++20.",
    metric: "3.27M ops/sec",
    result: "Speaks 53 Redis commands, peaks at 3.27M ops/sec, and runs in the browser via WebAssembly.",
    stack: ["C++20", "epoll", "RESP"],
    category: "other",
    url: "https://github.com/dhyanagni2001-commits/FlashKV",
    image: "projects/flashkv.svg",
  },
  {
    title: "InferOps Copilot — Kubernetes Inference Diagnostics",
    purpose:
      "Ask why a deployment keeps restarting: it reads pods, events, and logs through a read-only service account, classifies the root cause with deterministic rules, and streams a cited explanation in a React + FastAPI UI.",
    stack: ["FastAPI", "React", "kind"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/InferOps-Copilot",
    image: "projects/inferops.svg",
  },
  {
    title: "Edge AI Access Control on Snapdragon NPU",
    purpose:
      "Real-time face recognition with InsightFace / ArcFace compiled to QNN context binaries for the Snapdragon X Elite Hexagon NPU, with device alerts and on-device inference.",
    stack: ["InsightFace", "ArcFace", "QNN"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/Qualcomm_Hackathon",
    image: "projects/edge-ai-npu.svg",
  },
  {
    title: "ShopMind — Semantic E-commerce Search Agent",
    purpose:
      "Fine-tuned BERT bi-encoder trained with hard-negative contrastive learning, FAISS dense retrieval, and a LangGraph agent for multi-turn query refinement.",
    stack: ["BERT", "FAISS", "LangGraph"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/ShopMind",
    image: "projects/shopmind.svg",
  },
  {
    title: "HealthIQ — Agentic AI Healthcare Intelligence",
    purpose:
      "FastAPI + React platform that uses embeddings, FAISS, and LangGraph to search hospital records, flag data-quality gaps, and generate structured summaries.",
    metric: "0.97 MRR@10",
    result: "Dense retrieval scored 0.97 MRR@10 against 0.24 for keyword search on 40 held-out queries.",
    stack: ["FastAPI", "React", "FAISS", "LangGraph"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/Agentic-AI-Healthcare-Intelligence-System",
    image: "projects/healthiq.svg",
  },
  {
    title: "AutoTriage — Agentic Support-Ticket Triage",
    purpose:
      "LangGraph workflow combining a bi-encoder retriever over FAISS, a DistilBERT category/urgency classifier, rule-based routing, human review, optional LLM reply drafting, and a full audit trail.",
    stack: ["DistilBERT", "FAISS", "LangGraph"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/Autotriage-Workflow",
    image: "projects/autotriage.svg",
  },
  {
    title: "FraudMesh — Graph-Based Fraud Detection",
    purpose:
      "Builds a transaction graph from shared cards and devices and compares XGBoost, XGBoost with graph features, and GraphSAGE on PR-AUC and recall at fixed false-positive rates, including the negative results.",
    stack: ["PyG", "XGBoost", "GraphSAGE"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/FraudMesh",
    image: "projects/fraudmesh.svg",
  },
  {
    title: "TrojanGuide MCP — Campus Tools for AI Agents",
    purpose:
      "Local Model Context Protocol server that gives MCP clients typed tools to search USC buildings, libraries, dining, and student services instead of relying on what the model remembers.",
    metric: "67 places",
    result: "USC campus data as typed MCP tools.",
    stack: ["Python", "MCP", "stdio"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/TrojanGuide-MCP",
    image: "projects/trojanguide.svg",
  },
  {
    title: "OmniSort AI — Local-First File Organizer",
    purpose:
      "Watches folders and auto-sorts files using rules, OCR, and a local zero-shot DistilBERT classifier, with duplicate detection, semantic search, a FastAPI service, and an Electron dashboard.",
    stack: ["OCR", "DistilBERT", "FastAPI"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/Omnisort-AI",
    image: "projects/omnisort.svg",
  },
  {
    title: "GestureLens — In-Browser Gesture Recognition",
    purpose:
      "MobileNetV2 fine-tuned on seven hand-gesture classes and exported to TensorFlow.js for private, real-time webcam inference that never leaves the browser.",
    stack: ["MobileNetV2", "TensorFlow.js"],
    category: "ai",
    url: "https://github.com/dhyanagni2001-commits/GestureLens",
    image: "projects/gesturelens.svg",
  },
  {
    title: "Distributed Job Queue with PostgreSQL Coordination",
    purpose:
      "PostgreSQL-backed job queue with concurrent job claiming, retries, lease-based recovery, dead-letter handling, and Prometheus/Grafana monitoring.",
    metric: "17.8K jobs/s",
    result: "About 17,800 jobs per second over 100K jobs with 16 workers on a single machine.",
    stack: ["PostgreSQL", "Prometheus", "Grafana"],
    category: "other",
    url: "https://github.com/dhyanagni2001-commits/Distributed_Job_Queue",
    image: "projects/job-queue.svg",
  },
  {
    title: "LiDAR Crosswalk Counter",
    purpose:
      "Camera-free counting prototype: DBSCAN clusters 2D LiDAR points, centroids are tracked across frames, and virtual-line crossings give directional counts, with a Streamlit dashboard.",
    stack: ["DBSCAN", "Python", "Streamlit"],
    category: "other",
    url: "https://github.com/dhyanagni2001-commits/LiDAR-Based-Pedestrian-Counter-for-Crosswalks",
    image: "projects/lidar-counter.svg",
  },
  {
    title: "SettleUp — iOS Expense Splitting",
    purpose:
      "Native SwiftUI app with MVVM + Combine, Core Data + CloudKit sync, an on-device CoreML expense classifier, and a min-transaction debt-simplification engine.",
    stack: ["SwiftUI", "Core Data", "CloudKit"],
    category: "other",
    url: "https://github.com/dhyanagni2001-commits/SettleUp",
    image: "projects/settleup.svg",
  },
  {
    title: "CNCC Inventory — Offline Android Store App",
    purpose:
      "Kotlin + Jetpack Compose app for a clothing shop: scan a barcode to sell, record returns, export Excel reports and label PDFs, with nightly backups and idempotent sales that never double-count.",
    metric: "100K products",
    result: "Stress-tested with 100,000 products.",
    stack: ["Kotlin", "Compose", "Room"],
    category: "other",
    url: "https://github.com/dhyanagni2001-commits/CNCC_Inventory_Android",
    image: "projects/cncc-inventory.svg",
  },
  {
    title: "Rentals House Web — Full-Stack Rental Platform",
    purpose:
      "React/TypeScript frontend with Leaflet maps, favorites, real-time WebSocket chat, and Cypress E2E tests, backed by Dockerized ASP.NET microservices behind an API gateway.",
    stack: ["React", "TypeScript", "ASP.NET"],
    category: "web",
    url: "https://github.com/dhyanagni2001-commits/Rentals_House_Web_Frontend",
    image: "projects/rentals.svg",
  },
  {
    title: "SlideMentor — AI Study Companion",
    purpose:
      "Chrome extension that explains PDF lecture slides in context, answers follow-up questions, generates flashcards, and caches responses client-side.",
    stack: ["Chrome MV3", "LLM", "JavaScript"],
    category: "web",
    url: "https://github.com/dhyanagni2001-commits/Slidementor",
    image: "projects/slidementor.svg",
  },
];

export const milestones: {
  title: string;
  category: string;
  date: string;
  datetime: string;
  text: string;
  image?: string;
  alt?: string;
}[] = [
  {
    title: "AI Infra Summit Hackathon 2026 · 2nd place",
    category: "Qualcomm AI Hub track",
    date: "Sep 2026",
    datetime: "2026-09",
    text: "Built TrustGate Edge, real-time on-device access monitoring that flags unknown visitors without sending footage to the cloud. Optimized a vision model for the Snapdragon X Elite NPU: W8A16 quantization, 188/188 layers on the NPU, 1.71 ms inference.",
    image: "ai-infra-summit-hackathon-2026.jpg",
    alt: "AI Infra Summit Hackathon certificate awarded to Dhyan Agni, Sep 10 to 16, 2026",
  },
  {
    title: "Happiest Minds Technologies",
    category: "Insta Award",
    date: "July 2025",
    datetime: "2025-07",
    text: "Received the Insta Award for Best Learning of the Quarter at Happiest Minds Technologies for continuous learning and professional growth.",
    image: "IMG_0583.jpg",
    alt: "Insta Award certificate from Happiest Minds Technologies",
  },
  {
    title: "Happiest Minds Technologies",
    category: "Full-stack development",
    date: "Nov, 2024",
    datetime: "2024-11",
    text: "Completed Full-Stack Development training with CI/CD and Azure at NIIT StackRoute.",
    image: "WhatsApp Image 2026-01-16 at 20.12.40.jpeg",
    alt: "NIIT StackRoute full-stack development certificate",
  },
  {
    title: "Hostel Mess Attendance System",
    category: "Journal Publication",
    date: "July 2023",
    datetime: "2023-07",
    text: "Published a research paper on the Hostel Mess Attendance System, presenting an automated face-recognition-based attendance solution.",
    image: "4MC19CS043-PUBLICATION CERTIFICATE.jpg",
    alt: "IRJMETS journal publication certificate",
  },
];

export const featuredProjects = [
  {
    title: "HealthIQ",
    metric: "0.97 MRR@10",
    purpose: "An LLM serving and RAG backend that answers questions about 536K healthcare providers and 5,335 hospitals with streamed, cited answers.",
    result:
      "Dense retrieval scored 0.97 MRR@10 against 0.24 for keyword search on 40 held-out queries. The model runs on a separate vLLM GPU service, reaching 442 tokens per second on a T4.",
    stack: ["vLLM", "FAISS", "LangGraph", "FastAPI"],
    url: "https://github.com/dhyanagni2001-commits/Agentic-AI-Healthcare-Intelligence-System",
  },
  {
    title: "Distributed Job Queue",
    metric: "17.8K jobs/s",
    purpose: "A PostgreSQL-backed job queue with lease-based crash recovery, retries, and dead-lettering.",
    result:
      "Batching claims and completions raised throughput 16x, to about 17,800 jobs per second over 100K jobs with 16 workers on a single machine. Worker crash recovery is tested with SIGKILL in CI on every push.",
    stack: ["PostgreSQL", "Python", "GitHub Actions"],
    url: "https://github.com/dhyanagni2001-commits/Distributed_Job_Queue",
  },
  {
    title: "PayFlow",
    metric: "3.3K events/s",
    purpose: "A real-time change-data-capture lakehouse for a simulated payments processor.",
    result:
      "Changes flow from Postgres through Debezium and Kafka into Delta Lake on Databricks, orchestrated by Airflow. The ledger reconciles to the cent, and the pipeline was tested under 12 failure scenarios at over 3,300 events per second.",
    stack: ["Kafka", "Debezium", "Delta Lake", "Airflow"],
    url: "https://github.com/dhyanagni2001-commits/PayFlow",
  },
];

export const contactLinks = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/dhyan-agni/", icon: "linkedin" },
  { label: "GitHub", url: "https://github.com/dhyanagni2001-commits", icon: "github" },
] as const;

// EmailJS public identifiers (safe to ship to the browser).
export const emailJs = {
  serviceId: "service_wnrkg6r",
  templateId: "template_4eyokvp",
  publicKey: "EMfEegrAvCP49KYsC",
};

export const legacyAsset = (path: string) => `${import.meta.env.BASE_URL}legacy/assets/images/${encodeURI(path)}`;
