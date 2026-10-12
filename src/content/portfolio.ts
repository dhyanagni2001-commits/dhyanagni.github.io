// Portfolio content shown below the 3D intro. Images live in public/legacy/assets/images.

export type ProjectCategory = "ai" | "web" | "other";

export const projectCategories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI / ML" },
  { id: "web", label: "Web" },
  { id: "other", label: "Systems & Other" },
];

export const aboutParagraphs = [
  "I'm a software engineer and MS Computer Science candidate at USC. Before graduate school, I spent over a year at Happiest Minds building and maintaining production backend services used by 100K+ users. That experience taught me to think beyond features and consider performance, reliability, and how systems behave at scale.",
  "I'm especially interested in backend and distributed systems that make AI useful in the real world—from data pipelines and asynchronous processing to model-serving APIs, retrieval, and monitoring. I enjoy understanding difficult problems, finding the root cause, and building solutions that remain dependable beyond the demo.",
  "Outside of tech, you'll usually find me on a tennis court or playing squash.",
];

export const services = [
  {
    title: "Applied AI Systems",
    text: "Building AI applications around model-serving APIs, embeddings, retrieval, RAG, and agent workflows, with an emphasis on evaluation, latency, privacy, and reliable production behavior.",
    icon: "icon-design.svg",
  },
  {
    title: "Backend Engineering",
    text: "Designing APIs and microservices with Python, FastAPI, C#, and ASP.NET Core, backed by PostgreSQL, MySQL, and Redis. I focus on clear service boundaries, efficient data access, and maintainable systems.",
    icon: "icon-dev.svg",
  },
  {
    title: "Cloud & Reliability",
    text: "Deploying containerized services with Docker, CI/CD, AWS, and Azure, then using logging, metrics, and dashboards to understand performance and keep production systems healthy.",
    icon: "icon-dev.svg",
  },
  {
    title: "Distributed Systems",
    text: "Building event-driven and concurrent systems with Kafka and PostgreSQL, including a fault-tolerant distributed job queue tested under worker failures and race conditions, with observability for throughput, latency, and recovery.",
    icon: "icon-design.svg",
  },
];

export const timelines = [
  {
    title: "Education",
    items: [
      {
        title: "University of Southern California",
        period: "2025 — 2027",
        text: "I am a Master’s student in Computer Science at the USC Viterbi School of Engineering, concentrating on Artificial Intelligence and Machine Learning with an emphasis on scalable, real-world systems.",
      },
      {
        title: "Visvesvaraya Technological University",
        period: "2019 — 2023",
        text: "Bachelor of Engineering in Computer Science from Malnad College of Engineering (Visvesvaraya Technological University). Built a strong foundation in software engineering, data structures, and problem-solving through coursework and projects.",
      },
    ],
  },
  {
    title: "Experience",
    items: [
      {
        title: "Happiest Minds Technologies",
        period: "May 2024 - July 2025",
        text: "Software Engineer at Happiest Minds Technologies, building scalable backend services and web applications using ASP.NET Core, Angular, and MySQL. Optimized REST APIs and implemented Kafka-based asynchronous processing to improve performance and scalability. Containerized services using Docker and strengthened deployments through CI/CD pipelines. Resolved production issues efficiently to ensure high system reliability and uptime.",
      },
      {
        title: "Bounce",
        period: "Sep 2023 - Apr 2024",
        text: "Data Science Intern at Bounce, optimizing SQL queries and redesigning schemas for a ride-demand data pipeline using Python, SQL, and Tableau, cutting query load time by 35% for fleet-operations services. Engineered ETL pipelines in Python, SQL, and Pandas processing 10M+ ride and user activity records daily, improving data quality by 30% and downstream service reliability.",
      },
      {
        title: "Coulomb AI (YC-backed)",
        period: "Mar 2023 - Aug 2023",
        text: "Data Science Intern at Coulomb AI, engineering large-scale ETL pipelines in Python and SQL to process 5M+ battery telemetry records, powering downstream remaining useful life (RUL) prediction and anomaly-detection services. Deployed RUL prediction and anomaly-detection models as production inference services on Amazon SageMaker, achieving 85% accuracy.",
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
        period: "Aug 2019 — Aug 2023",
        text: "Led technical operations for SCIENTIA events with 400+ attendees, managing audio-visual systems and resolving live technical issues to ensure smooth execution. Built a Flutter-based online treasure hunt platform and the association website to improve participation and event management. Mentored students in Photoshop, video editing, and digital content creation, while collaborating with student leaders to organize and promote technical, academic, and cultural events.",
      },
      {
        title: "Founding Member · AWAKE",
        period: "Student Technical Community",
        text: "Helped establish a student-led technical community focused on practical learning and collaboration. Organized hackathons and hands-on workshops, and conducted sessions on Swift, Dart, and Flutter development to help students build mobile applications and strengthen their development skills.",
      },
    ],
  },
];

export const skills = [
  { label: "Programming Languages", items: "Python, C++, JavaScript, TypeScript, SQL" },
  { label: "Backend & APIs", items: "ASP.NET Core, Flask, FastAPI, REST APIs, Microservices" },
  { label: "Frontend", items: "React, Angular" },
  {
    label: "Machine Learning & AI",
    items: "Scikit-learn, PyTorch, TensorFlow, Transformers, XGBoost, OpenCV, YOLO, NLP",
  },
  { label: "Data & Analytics", items: "Pandas, NumPy, Data Cleaning, Feature Engineering, EDA, Matplotlib, Seaborn" },
  { label: "Databases & Caching", items: "MySQL, MongoDB, Redis" },
  {
    label: "Cloud & DevOps",
    items: "AWS, Azure, AWS SageMaker, Docker, Kubernetes, Kafka, CI/CD Pipelines, Linux, Git",
  },
  {
    label: "Distributed",
    items: "Microservices, Sharding, Replication, Message Queues, Event-Driven Architecture, Worker Leasing",
  },
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

export const milestones = [
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
    title: "PayFlow",
    summary: "Real-time payments CDC lakehouse",
    metric: "3.3K events/s",
    detail: "Zero loss across 12 chaos tests",
    stack: ["Kafka", "Debezium", "Delta Lake", "Airflow"],
    url: "https://github.com/dhyanagni2001-commits/PayFlow",
  },
  {
    title: "FlashKV",
    summary: "Redis-compatible key-value store in C++20",
    metric: "3.27M ops/s",
    detail: "53 Redis commands, runs in the browser via WebAssembly",
    stack: ["C++20", "Event loop", "WebAssembly"],
    url: "https://github.com/dhyanagni2001-commits/FlashKV",
  },
  {
    title: "First Fifty",
    summary: "Agentic battery-cell triage",
    metric: "7–8 of top 10",
    detail: "Longest-lived cells found after only 50 cycles",
    stack: ["Claude agents", "Databricks", "Python"],
    url: "https://github.com/dhyanagni2001-commits/First_Fifty",
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
