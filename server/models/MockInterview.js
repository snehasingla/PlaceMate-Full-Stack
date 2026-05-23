const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: 'Fresher'
  },
  qaList: [
    {
      question: String,
      questionType: String, // 'Technical' or 'HR'
      answer: String,
      feedback: String,
      rating: Number // 1 to 10
    }
  ],
  overallScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
