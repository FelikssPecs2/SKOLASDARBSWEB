let chartInstance = null;

document.getElementById('macroForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const sex = document.getElementById('sex').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = document.getElementById('goal').value;
    const proteinPercent = parseFloat(document.getElementById('protein').value);
    const fatPercent = parseFloat(document.getElementById('fat').value);
    const carbPercent = parseFloat(document.getElementById('carb').value);

    // BMR calculation (Mifflin-St Jeor)
    let bmr;
    if(sex === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // TDEE
    let tdee = bmr * activity;

    // Adjust for goal
    let dailyTarget;
    if(goal === "cut") dailyTarget = tdee * 0.8;
    else if(goal === "bulk") dailyTarget = tdee * 1.2;
    else dailyTarget = tdee;

    // Macronutrients in grams
    const proteinCalories = dailyTarget * (proteinPercent / 100);
    const fatCalories = dailyTarget * (fatPercent / 100);
    const carbCalories = dailyTarget * (carbPercent / 100);

    const proteinGrams = proteinCalories / 4;
    const fatGrams = fatCalories / 9;
    const carbGrams = carbCalories / 4;

    // Display results
    document.getElementById('bmr').textContent = `BMR: ${bmr.toFixed(0)} kcal`;
    document.getElementById('tdee').textContent = `TDEE: ${tdee.toFixed(0)} kcal`;
    document.getElementById('dailyTarget').textContent = `Daily Target: ${dailyTarget.toFixed(0)} kcal`;

    document.getElementById('macroTable').innerHTML = `
        <tr><td>Protein</td><td>${proteinGrams.toFixed(1)}</td><td>${proteinCalories.toFixed(0)}</td><td>${proteinPercent}%</td></tr>
        <tr><td>Fat</td><td>${fatGrams.toFixed(1)}</td><td>${fatCalories.toFixed(0)}</td><td>${fatPercent}%</td></tr>
        <tr><td>Carbohydrate</td><td>${carbGrams.toFixed(1)}</td><td>${carbCalories.toFixed(0)}</td><td>${carbPercent}%</td></tr>
    `;

    // Draw pie chart
    const ctx = document.getElementById('macroChart').getContext('2d');
    const data = {
        labels: ['Protein', 'Fat', 'Carbohydrates'],
        datasets: [{
            data: [proteinCalories, fatCalories, carbCalories],
            backgroundColor: ['#4caf50', '#ff9800', '#03a9f4'],
            hoverOffset: 10
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    };

    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, config);
});
