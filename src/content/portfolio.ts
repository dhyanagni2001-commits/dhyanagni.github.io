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

export const projects: { title: string; description: string; category: ProjectCategory; url: string; image: string }[] =
  [
    {
      title: "First Fifty — Agentic Battery-Cell Triage",
      description:
        "Team of five Claude agents that pick which battery cells deserve a full life test after only 50 cycles, with human approval on every call and leakage-safe evaluation. Found 7–8 of the 10 longest-lived cells on a sealed batch. Built for Hack-Nation × Databricks.",
      category: "ai",
      url: "https://github.com/dhyanagni2001-commits/First_Fifty",
      image: "projects/first-fifty.svg",
    },
    {
      title: "PayFlow — Real-Time Payments CDC Lakehouse",
      description:
        "Postgres → Debezium → Kafka → Parquet → Delta Lake (bronze/silver/gold) on Databricks, orchestrated by Airflow. Reconciled to the cent with zero loss across 12 chaos tests at ≥3.3K events/s.",
      category: "other",
      url: "https://github.com/dhyanagni2001-commits/PayFlow",
      image: "projects/payflow.svg",
    },
    {
      title: "FlashKV — Redis-Compatible Key-Value Store",
      description:
        "Event-driven, in-memory key-value database written from scratch in C++20. Speaks 53 Redis commands, peaks at 3.27M ops/sec, and runs in the browser via WebAssembly.",
      category: "other",
      url: "https://github.com/dhyanagni2001-commits/FlashKV",
      image: "projects/flashkv.svg",
    },
    {
      title: "Edge AI Access Control on Snapdragon NPU",
      description:
        "Real-time face recognition with InsightFace / ArcFace compiled to QNN context binaries for the Snapdragon X Elite Hexagon NPU, with device alerts and on-device inference.",
      category: "ai",
      url: "https://github.com/dhyanagni2001-commits/Qualcomm_Hackathon",
      image: "projects/edge-ai-npu.svg",
    },
    {
      title: "ShopMind — Semantic E-commerce Search Agent",
      description:
        "Fine-tuned BERT bi-encoder trained with hard-negative contrastive learning, FAISS dense retrieval, and a LangGraph agent for multi-turn query refinement.",
      category: "ai",
      url: "https://github.com/dhyanagni2001-commits/ShopMind",
      image: "projects/shopmind.svg",
    },
    {
      title: "HealthIQ — Agentic AI Healthcare Intelligence",
      description:
        "FastAPI + React platform that uses embeddings, FAISS, and LangGraph to search hospital records, flag data-quality gaps, and generate structured summaries.",
      category: "ai",
      url: "https://github.com/dhyanagni2001-commits/Agentic-AI-Healthcare-Intelligence-System",
      image: "projects/healthiq.svg",
    },
    {
      title: "AutoTriage — Agentic Support-Ticket Triage",
      description:
        "LangGraph workflow combining a bi-encoder retriever over FAISS, a DistilBERT category/urgency classifier, rule-based routing, human review, optional LLM reply drafting, and a full audit trail.",
      category: "ai",
      url: "https://github.com/dhyanagni2001-commits/Autotriage-Workflow",
      image: "projects/autotriage.svg",
    },
    {
      title: "OmniSort AI — Local-First File Organizer",
      description:
        "Watches folders and auto-sorts files using rules, OCR, and a local zero-shot DistilBERT classifier, with duplicate detection, semantic search, a FastAPI service, and an Electron dashboard.",
      category: "ai",
      url: "https://github.com/dhyanagni2001-commits/Omnisort-AI",
      image: "projects/omnisort.svg",
    },
    {
      title: "GestureLens — In-Browser Gesture Recognition",
      description:
        "MobileNetV2 fine-tuned on seven hand-gesture classes and exported to TensorFlow.js for private, real-time webcam inference that never leaves the browser.",
      category: "ai",
      url: "https://github.com/dhyanagni2001-commits/GestureLens",
      image: "projects/gesturelens.svg",
    },
    {
      title: "Distributed Job Queue with PostgreSQL Coordination",
      description:
        "PostgreSQL-backed job queue with concurrent job claiming, retries, lease-based recovery, dead-letter handling, and Prometheus/Grafana monitoring.",
      category: "other",
      url: "https://github.com/dhyanagni2001-commits/Distributed_Job_Queue",
      image: "projects/job-queue.svg",
    },
    {
      title: "SettleUp — iOS Expense Splitting",
      description:
        "Native SwiftUI app with MVVM + Combine, Core Data + CloudKit sync, an on-device CoreML expense classifier, and a min-transaction debt-simplification engine.",
      category: "other",
      url: "https://github.com/dhyanagni2001-commits/SettleUp",
      image: "projects/settleup.svg",
    },
    {
      title: "Rentals House Web — Full-Stack Rental Platform",
      description:
        "React/TypeScript frontend with Leaflet maps, favorites, real-time WebSocket chat, and Cypress E2E tests, backed by Dockerized ASP.NET microservices behind an API gateway.",
      category: "web",
      url: "https://github.com/dhyanagni2001-commits/Rentals_House_Web_Frontend",
      image: "projects/rentals.svg",
    },
    {
      title: "SlideMentor — AI Study Companion",
      description:
        "Chrome extension that explains PDF lecture slides in context, answers follow-up questions, generates flashcards, and caches responses client-side.",
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
    description:
      "An LLM serving and RAG backend that answers questions about 536K healthcare providers and 5,335 hospitals with streamed, cited answers. Dense retrieval scored 0.97 MRR@10 against 0.24 for keyword search on 40 held-out queries. The model runs on a separate vLLM GPU service, reaching 442 tokens per second on a T4.",
    stack: ["vLLM", "FAISS", "LangGraph", "FastAPI"],
    url: "https://github.com/dhyanagni2001-commits/Agentic-AI-Healthcare-Intelligence-System",
  },
  {
    title: "Distributed Job Queue",
    metric: "17.8K jobs/s",
    description:
      "A PostgreSQL-backed job queue with lease-based crash recovery, retries, and dead-lettering. Batching claims and completions raised throughput 16x, to about 17,800 jobs per second over 100K jobs with 16 workers on a single machine. Worker crash recovery is tested with SIGKILL in CI on every push.",
    stack: ["PostgreSQL", "Python", "GitHub Actions"],
    url: "https://github.com/dhyanagni2001-commits/Distributed_Job_Queue",
  },
  {
    title: "PayFlow",
    metric: "3.3K events/s",
    description:
      "A real-time change-data-capture lakehouse for a simulated payments processor. Changes flow from Postgres through Debezium and Kafka into Delta Lake on Databricks, orchestrated by Airflow. The ledger reconciles to the cent, and the pipeline was tested under 12 failure scenarios at over 3,300 events per second.",
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
