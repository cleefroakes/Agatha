const express = require('express');
const fs = require('fs');
const path = require('path');
const say = require('say');
const router = express.Router();

// ==== Load knowledge base ====
const knowledgeFilePath = path.join(__dirname, '../knowledge/knowledge.json');

let knowledgeBase = {};
try {
  if (fs.existsSync(knowledgeFilePath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(knowledgeFilePath, 'utf-8'));
  } else {
    console.warn('⚠️ knowledge.json not found. Tutor will respond with fallback messages.');
  }
} catch (err) {
  console.error('❌ Failed to load knowledge base:', err.message);
}

// ==== Simple keyword matching function ====
function findResponse(topic, question) {
  const topicData = knowledgeBase[topic.toLowerCase()];
  if (!topicData) {
    return {
      explanation: `Sorry, I don't have information on "${topic}" yet.`,
      chartData: null
    };
  }

  const questionLower = question.toLowerCase();
  let explanation = 'Sorry, I couldn’t find a specific answer. Please rephrase.';
  let chartData = null;

  for (const entry of topicData) {
    if (entry.keywords.some(keyword => questionLower.includes(keyword))) {
      explanation = entry.response;
      chartData = entry.chartData || null;
      break;
    }
  }

  return { explanation, chartData };
}

// ==== POST /api/tutor ====
router.post('/', async (req, res) => {
  const { topic, question } = req.body;

  if (!topic || !question) {
    return res.status(400).json({ error: 'Both topic and question are required.' });
  }

  try {
    const { explanation, chartData } = findResponse(topic, question);

    // Create an audio response
    const audioDir = path.join(__dirname, '../audio');
    if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir); // Ensure audio directory exists

    const audioFileName = `response_${Date.now()}.wav`;
    const audioFilePath = path.join(audioDir, audioFileName);

    await new Promise((resolve, reject) => {
      say.export(explanation, null, 1, audioFilePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.json({
      explanation,
      chartData,
      audioUrl: `/audio/${audioFileName}`,
    });
  } catch (error) {
    console.error('❌ Error in /api/tutor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
