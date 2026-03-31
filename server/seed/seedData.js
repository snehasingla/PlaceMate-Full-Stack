// seed/seedData.js
// Run with: node seed/seedData.js
// Populates the DB with demo questions and one demo user

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const MockQuestion = require("../models/MockQuestion");

const questions = [
  // Technical
  { question: "What is the difference between stack and heap memory?", type: "technical", subject: "OS", difficulty: "Easy", tags: ["memory", "OS"], isGlobal: true },
  { question: "Explain ACID properties in databases.", type: "technical", subject: "DBMS", difficulty: "Medium", tags: ["DBMS", "transactions"], isGlobal: true },
  { question: "What is a deadlock and how do you prevent it?", type: "technical", subject: "OS", difficulty: "Medium", tags: ["OS", "deadlock"], isGlobal: true },
  { question: "What is the difference between TCP and UDP?", type: "technical", subject: "CN", difficulty: "Easy", tags: ["CN", "networking"], isGlobal: true },
  { question: "Explain the concept of polymorphism with an example.", type: "technical", subject: "OOP", difficulty: "Easy", tags: ["OOP"], isGlobal: true },
  { question: "What is the time complexity of quicksort in best, average, and worst cases?", type: "technical", subject: "DSA", difficulty: "Medium", tags: ["DSA", "sorting"], isGlobal: true },
  { question: "Explain how a hash table works internally.", type: "technical", subject: "DSA", difficulty: "Medium", tags: ["DSA", "hashing"], isGlobal: true },
  { question: "What is virtual memory and how does it work?", type: "technical", subject: "OS", difficulty: "Hard", tags: ["OS", "memory"], isGlobal: true },
  { question: "Difference between SQL and NoSQL databases.", type: "technical", subject: "DBMS", difficulty: "Easy", tags: ["DBMS"], isGlobal: true },
  { question: "What is the OSI model? Explain each layer.", type: "technical", subject: "CN", difficulty: "Medium", tags: ["CN", "OSI"], isGlobal: true },

  // HR
  { question: "Tell me about yourself.", type: "hr", subject: "General", difficulty: "Easy", tags: ["intro"], isGlobal: true },
  { question: "Where do you see yourself in 5 years?", type: "hr", subject: "General", difficulty: "Easy", tags: ["career"], isGlobal: true },
  { question: "Why do you want to work at our company?", type: "hr", subject: "General", difficulty: "Medium", tags: ["motivation"], isGlobal: true },
  { question: "What is your greatest strength and weakness?", type: "hr", subject: "General", difficulty: "Easy", tags: ["self-awareness"], isGlobal: true },

  // Behavioral
  { question: "Tell me about a time you failed and what you learned.", type: "behavioral", subject: "General", difficulty: "Medium", tags: ["failure", "growth"], isGlobal: true },
  { question: "Describe a situation where you worked under pressure.", type: "behavioral", subject: "General", difficulty: "Medium", tags: ["pressure", "teamwork"], isGlobal: true },
  { question: "Give an example of a time you resolved a conflict in a team.", type: "behavioral", subject: "General", difficulty: "Medium", tags: ["conflict", "teamwork"], isGlobal: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Remove existing global questions to avoid duplicates
    await MockQuestion.deleteMany({ isGlobal: true });
    await MockQuestion.insertMany(questions);

    console.log(`✅ Seeded ${questions.length} global mock questions`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seedDB();
