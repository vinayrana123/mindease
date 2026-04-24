const getMoodSuggestion = ({ mood, stressLevel, anxietyLevel, sleepHours }) => {
  if (stressLevel >= 8 || anxietyLevel >= 8) {
    return 'High tension detected. Try a 4-7-8 breathing cycle, reduce stimulation, and consider booking support.';
  }

  if (sleepHours < 5) {
    return 'Low sleep can intensify emotions. Prioritize a calming evening routine and a lighter schedule if possible.';
  }

  if (['sad', 'overwhelmed', 'burned-out'].includes(mood)) {
    return 'A gentler day may help. Journal one feeling, message someone you trust, and choose one low-pressure win.';
  }

  if (['calm', 'hopeful', 'grateful'].includes(mood)) {
    return 'You are in a steady rhythm today. Reinforce it with a short walk, hydration, and a mindful pause.';
  }

  return 'A small reset can help. Try stretching, drinking water, and taking a 10-minute screen break.';
};

const getWellnessScore = ({ stressLevel, anxietyLevel, sleepHours }) => {
  const sleepScore = Math.min((sleepHours / 8) * 30, 30);
  const stressScore = Math.max(0, 35 - stressLevel * 3);
  const anxietyScore = Math.max(0, 35 - anxietyLevel * 3);
  return Math.round(Math.min(100, sleepScore + stressScore + anxietyScore));
};

module.exports = { getMoodSuggestion, getWellnessScore };
