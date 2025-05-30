const alertSummaryTemplate = (alerts = []) => {
  // Group alerts by lowercase type
  const grouped = alerts.reduce((acc, alert) => {
    const type = (alert.type || 'unknown').toLowerCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(alert);
    return acc;
  }, {});

  // Generate HTML cards for each alert type
  const alertSections = Object.entries(grouped).map(([type, alertsOfType]) => {
    const alertsList = alertsOfType.map(alert => `
      <li style="margin-bottom: 10px;">
        <strong>${alert.title}</strong><br />
        <span style="color: #555;">${alert.message}</span>
      </li>
    `).join('');

    // Pick a nice color for each alert type
    let borderColor = '#0077cc'; // default blue
    if (type === 'weather') borderColor = '#ff9800'; // orange
    else if (type === 'news') borderColor = '#4caf50'; // green
    else if (type === 'flight') borderColor = '#e91e63'; // pink

    return `
      <div style="
        background: #f9f9f9;
        border-left: 6px solid ${borderColor};
        padding: 15px 20px;
        margin-bottom: 20px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        <h3 style="
          margin: 0 0 12px;
          font-family: Arial, sans-serif;
          color: ${borderColor};
          text-transform: capitalize;
        ">
          ${type} Alerts (${alertsOfType.length})
        </h3>
        <ul style="
          padding-left: 20px;
          margin: 0;
          font-family: Arial, sans-serif;
          color: #333;
          list-style-type: disc;
        ">
          ${alertsList}
        </ul>
      </div>
    `;
  }).join('');

  return `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #222;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    ">
      <h2 style="
        color: #004a99;
        border-bottom: 2px solid #0077cc;
        padding-bottom: 8px;
        font-weight: 700;
      ">
        🛫 TravelSync Alert Summary
      </h2>
      <p style="font-size: 1em; margin: 15px 0 25px;">
        You have <strong>${alerts.length}</strong> new alert${alerts.length > 1 ? 's' : ''} for your trip:
      </p>
      ${alertSections}
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
      <p style="font-size: 0.85em; color: gray; text-align: center;">
        You're receiving this because you subscribed to trip alerts on TravelSync.
      </p>
    </div>
  `;
};

module.exports = alertSummaryTemplate;
