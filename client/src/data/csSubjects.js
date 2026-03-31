export const csSubjectsData = {
  // ------------------------------------
  // CATEGORY: CORE CS
  // ------------------------------------
  os: {
    id: "os",
    category: "Core CS",
    title: "Operating Systems",
    description: "Core concepts of process management, memory, and concurrency.",
    topics: [
      { id: "os-1", title: "Processes & Threads", subtopics: ["Process Control Block (PCB)", "Context Switching", "User vs Kernel Threads", "Process States"], importance: "High" },
      { id: "os-2", title: "CPU Scheduling", subtopics: ["FCFS & SJF", "Round Robin", "Priority Scheduling", "Multilevel Queue"], importance: "High" },
      { id: "os-3", title: "Process Synchronization", subtopics: ["Critical Section Problem", "Mutex & Semaphores", "Peterson's Solution", "Monitors"], importance: "Critical" },
      { id: "os-4", title: "Deadlocks", subtopics: ["Necessary Conditions", "Banker's Algorithm", "Deadlock Prevention vs Avoidance"], importance: "Critical" },
      { id: "os-5", title: "Memory Management", subtopics: ["Paging vs Segmentation", "Virtual Memory", "TLB", "Page Replacement (LRU, FIFO)"], importance: "High" }
    ],
    resources: [{ id: "r1", title: "Top 50 OS Interview Questions", type: "article", url: "#" }]
  },
  dbms: {
    id: "dbms",
    category: "Core CS",
    title: "Database Management Systems",
    description: "ACID properties, Normalization, Indexing, and SQL.",
    topics: [
      { id: "dbms-1", title: "ER Modeling", subtopics: ["Entities & Attributes", "Keys (Primary, Foreign, Candidate)"], importance: "Medium" },
      { id: "dbms-2", title: "Normalization", subtopics: ["1NF, 2NF, 3NF", "BCNF", "Anomalies"], importance: "Critical" },
      { id: "dbms-3", title: "Transactions & Concurrency", subtopics: ["ACID Properties", "Schedules & Serializability", "Locks & Deadlocks in DB"], importance: "Critical" },
      { id: "dbms-4", title: "Indexing & Hashing", subtopics: ["B Trees vs B+ Trees", "Primary vs Secondary Indexing"], importance: "High" }
    ],
    resources: [{ id: "r2", title: "SQL Cheat Sheet", type: "pdf", url: "#" }]
  },
  cn: {
    id: "cn",
    category: "Core CS",
    title: "Computer Networks",
    description: "OSI Model, TCP/IP Suite, routing, and application protocols.",
    topics: [
      { id: "cn-1", title: "Network Models", subtopics: ["OSI 7 Layers", "TCP/IP Suite", "Encapsulation & Decapsulation"], importance: "Critical" },
      { id: "cn-2", title: "Network & Transport Layer", subtopics: ["IPv4 vs IPv6", "TCP vs UDP", "Congestion Control", "Subnetting"], importance: "Critical" },
      { id: "cn-3", title: "Application Layer & Protocols", subtopics: ["HTTP/HTTPS", "DNS Resolution", "SMTP, FTP", "WebSockets"], importance: "High" },
      { id: "cn-4", title: "Routing & Switching", subtopics: ["Routers vs Switches vs Hubs", "Distance Vector vs Link State", "BGP Basics"], importance: "Medium" }
    ],
    resources: [{ id: "r3", title: "CN Protocol Cheatsheet", type: "pdf", url: "#" }]
  },
  oop: {
    id: "oop",
    category: "Core CS",
    title: "Object-Oriented Programming",
    description: "Pillars of OOP, SOLID principles, and design patterns.",
    topics: [
      { id: "oop-1", title: "The 4 Pillars", subtopics: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism (Compile vs Run time)"], importance: "Critical" },
      { id: "oop-2", title: "Advanced Concepts", subtopics: ["Abstract Classes vs Interfaces", "Virtual Functions", "Constructors & Destructors", "Method Overloading vs Overriding"], importance: "High" },
      { id: "oop-3", title: "SOLID Principles", subtopics: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"], importance: "Critical" }
    ],
    resources: [{ id: "r4", title: "Java OOP Handbook", type: "pdf", url: "#" }]
  },
  sdlc: {
    id: "sdlc",
    category: "Core CS",
    title: "Software Engineering & SDLC",
    description: "Agile, testing techniques, requirement gathering, and process models.",
    topics: [
      { id: "sdlc-1", title: "Process Models", subtopics: ["Waterfall Model", "Agile Methodology", "Scrum Framework", "Iterative vs Spiral"], importance: "High" },
      { id: "sdlc-2", title: "Requirements & Testing", subtopics: ["Functional vs Non-Functional", "Unit Testing", "Integration & System Testing", "Blackbox vs Whitebox Testing"], importance: "Critical" },
      { id: "sdlc-3", title: "Maintenance & DevOps", subtopics: ["CI/CD Pipeline concepts", "Version Control (Git)", "Software Maintenance phases"], importance: "Medium" }
    ],
    resources: [{ id: "r5", title: "Agile Manifesto Guide", type: "article", url: "#" }]
  },
  linux: {
    id: "linux",
    category: "Core CS",
    title: "Linux & Shell",
    description: "File system hierarchy, permissions, and essential shell commands.",
    topics: [
      { id: "linux-1", title: "File System & Permissions", subtopics: ["Root hierarchy", "chmod & chown", "Hard links vs Soft links", "File descriptors"], importance: "Critical" },
      { id: "linux-2", title: "Text Processing", subtopics: ["grep", "awk", "sed", "Pipes and Redirection"], importance: "High" },
      { id: "linux-3", title: "Process & Network Config", subtopics: ["ps, top, kill", "Daemons & Systemd", "ping, netstat, curl, ssh"], importance: "High" }
    ],
    resources: [{ id: "r6", title: "Linux Commands Cheatsheet", type: "pdf", url: "#" }]
  },

  // ------------------------------------
  // CATEGORY: ADVANCED / INTERVIEW PREP
  // ------------------------------------
  system_design: {
    id: "system_design",
    category: "Advanced / Interview Prep",
    title: "System Design",
    description: "Architecture, trade-offs, scalability, and high availability.",
    topics: [
      { id: "sd-1", title: "Scalability Patterns", subtopics: ["Vertical vs Horizontal Scaling", "Load Balancing", "Consistent Hashing"], importance: "Critical" },
      { id: "sd-2", title: "Caching & Storage", subtopics: ["Caching Strategies (Write-through, Read-through)", "Redis / Memcached", "CDN Basics"], importance: "Critical" },
      { id: "sd-3", title: "Databases", subtopics: ["SQL vs NoSQL", "CAP Theorem", "Database Sharding & Partitioning", "Replication strategies"], importance: "Critical" },
      { id: "sd-4", title: "Microservices", subtopics: ["Monolith vs Microservices", "Message Queues (Kafka, RabbitMQ)", "Rate Limiting", "API Gateways"], importance: "High" }
    ],
    resources: [{ id: "r7", title: "System Design Primer", type: "article", url: "https://github.com/donnemartin/system-design-primer" }]
  },
  cloud: {
    id: "cloud",
    category: "Advanced / Interview Prep",
    title: "Cloud Computing",
    description: "Distributed infrastructure, containers, and deployment solutions.",
    topics: [
      { id: "cloud-1", title: "Cloud Basics", subtopics: ["IaaS vs PaaS vs SaaS", "Public, Private, Hybrid Cloud", "Virtualization Concepts"], importance: "High" },
      { id: "cloud-2", title: "Containers & Orchestration", subtopics: ["Docker architecture", "Images vs Containers", "Kubernetes (Pods, Nodes, Clusters)", "Container registries"], importance: "Critical" },
      { id: "cloud-3", title: "Infrastructure Mgmt", subtopics: ["Autoscaling", "Object Storage (S3)", "Cloud Identity & IAM", "Serverless Computing"], importance: "Medium" }
    ],
    resources: [{ id: "r8", title: "Docker Cheatsheet", type: "pdf", url: "#" }]
  },

  // ------------------------------------
  // CATEGORY: QUANT / FOUNDATIONS
  // ------------------------------------
  aptitude: {
    id: "aptitude",
    category: "Quant / Foundations",
    title: "Quantitative Aptitude",
    description: "Mathematical problems targeting general reasoning and problem-solving.",
    topics: [
      { id: "apt-1", title: "Arithmetic", subtopics: ["Ratios & Proportions", "Profit & Loss", "Percentages", "Simple & Compound Interest"], importance: "Critical" },
      { id: "apt-2", title: "Speed & Time", subtopics: ["Time & Work", "Pipes & Cisterns", "Speed, Distance & Time", "Problems on Trains"], importance: "High" },
      { id: "apt-3", title: "Combinatorics", subtopics: ["Permutations & Combinations", "Probability Basics", "Data Interpretation"], importance: "High" }
    ],
    resources: [{ id: "r9", title: "Aptitude Formula Sheet", type: "pdf", url: "#" }]
  },
  linear_algebra: {
    id: "linear_algebra",
    category: "Quant / Foundations",
    title: "Linear Algebra",
    description: "Vectors, matrices, and transformations essential for AI/ML foundations.",
    topics: [
      { id: "la-1", title: "Matrices", subtopics: ["Matrix Operations", "Determinants", "Inverse of a Matrix", "Rank of Matrix"], importance: "High" },
      { id: "la-2", title: "Vector Spaces", subtopics: ["Vectors in Rn", "Linear Independence", "Basis & Dimension"], importance: "Medium" },
      { id: "la-3", title: "Eigen Theory", subtopics: ["Eigenvalues & Eigenvectors", "Diagonalization"], importance: "High" }
    ],
    resources: [{ id: "r10", title: "Essence of Linear Algebra", type: "video", url: "https://youtube.com/playlist" }]
  },
  math: {
    id: "math",
    category: "Quant / Foundations",
    title: "Basic Mathematics",
    description: "Foundational mathematics for algorithm analysis and logic.",
    topics: [
      { id: "math-1", title: "Number Theory", subtopics: ["Prime Numbers", "GCD & LCM", "Modular Arithmetic", "Factorials"], importance: "High" },
      { id: "math-2", title: "Logarithms & Progressions", subtopics: ["Properties of Logs", "AP, GP, HP Progressions", "Summation formulas"], importance: "High" },
      { id: "math-3", title: "Discrete Math", subtopics: ["Set Theory", "Propositional Logic", "Graph Theory basics"], importance: "Medium" }
    ],
    resources: [{ id: "r11", title: "Discrete Math Quick Review", type: "article", url: "#" }]
  }
};
