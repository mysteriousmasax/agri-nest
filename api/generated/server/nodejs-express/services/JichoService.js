async function diagnose(data) {
  const diagnoses = ['Yellow Rust', 'Leaf Blight', 'Healthy', 'Bean Rust'];
  const choice = diagnoses[Math.floor(Math.random() * diagnoses.length)];
  return {
    diagnosis: choice,
    confidence: Math.round((0.5 + Math.random() * 0.5) * 100) / 100,
    recommended_treatment: 'Follow label instructions'
  };
}

module.exports = { diagnose };
