const presets = {
  shop: { electricity: 300, fuel: 20, waste: 10 },
  restaurant: { electricity: 600, fuel: 50, waste: 40 },
  office: { electricity: 400, fuel: 10, waste: 15 }
};

function applyPreset(type) {
  document.getElementById("electricity").value = presets[type].electricity;
  document.getElementById("fuel").value = presets[type].fuel;
  document.getElementById("waste").value = presets[type].waste;
}

function calculate() {
  const electricity = Number(document.getElementById("electricity").value || 0);
  const fuel = Number(document.getElementById("fuel").value || 0);
  const waste = Number(document.getElementById("waste").value || 0);

  const electricityCO2 = electricity * emissionFactors.electricity;
  const fuelCO2 = fuel * emissionFactors.petrol;
  const wasteCO2 = waste * emissionFactors.waste;
  const totalCO2 = electricityCO2 + fuelCO2 + wasteCO2;

  document.getElementById("result").innerText = 
    `Total Emissions: ${totalCO2.toFixed(2)} kg CO₂ / month`;

  const scoreElement = document.getElementById("score");
  scoreElement.innerText = `Carbon Score: ${carbonScore(totalCO2)}`;
  if (totalCO2 < 200) scoreElement.style.color = "#2ecc71";
  else if (totalCO2 < 400) scoreElement.style.color = "#f1c40f";
  else if (totalCO2 < 600) scoreElement.style.color = "#e67e22";
  else scoreElement.style.color = "#e74c3c";

  drawChart(electricityCO2, fuelCO2, wasteCO2);
  showRecommendations(electricityCO2, fuelCO2, wasteCO2);

  if (document.getElementById("meterFill")) updateMeter(totalCO2);
}

function drawChart(electricity, fuel, waste) {
  const ctx = document.getElementById('carbonChart').getContext('2d');
  if (window.pieChart) window.pieChart.destroy();
  window.pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Electricity', 'Fuel', 'Waste'],
      datasets: [{
        data: [electricity, fuel, waste],
        backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c']
      }]
    },
    options: { animation: { duration: 1000, easing: 'easeOutBounce' } }
  });
}

function showRecommendations(electricity, fuel, waste) {
  let tips = "Recommendations:\n";
  if (electricity > fuel && electricity > waste) tips += "- Switch to LED lighting and energy-efficient appliances.\n";
  if (fuel > electricity) tips += "- Reduce generator usage or optimize delivery routes.\n";
  if (waste > 20) tips += "- Improve waste sorting and recycling practices.\n";
  alert(tips);
}

function carbonScore(total) {
  if (total < 200) return "A (Excellent)";
  if (total < 400) return "B (Good)";
  if (total < 600) return "C (Average)";
  if (total < 800) return "D (High)";
  return "E (Very High)";
}

function updateMeter(score) {
  const maxScore = 500;
  const percentage = Math.min(score / maxScore, 1);
  const rotation = percentage / 2;
  document.getElementById("meterFill").style.transform = `rotate(${rotation}turn)`;
  document.getElementById("meterValue").innerText = Math.floor(score);

  const feedback = document.getElementById("feedbackText");
  if (!feedback) return;

  if (score < 150) {
    feedback.innerText = "🌱 Low Impact - Keep it up!";
    document.querySelector('img[alt="Carbon meter"]').src = "images/tree.gif";
  } else if (score < 350) {
    feedback.innerText = "⚠️ Moderate Impact - Room to improve.";
    document.querySelector('img[alt="Carbon meter"]').src = "images/meter.gif";
  } else {
    feedback.innerText = "🔥 High Impact - Consider reducing usage.";
    document.querySelector('img[alt="Carbon meter"]').src = "images/fire.gif";
  }
}