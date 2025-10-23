# Fleet Preventive Maintenance Dashboard

A comprehensive fleet management portal based on OBD-II data, inspired by Samsara, Motive, and On.Start platforms. Built with React, Tailwind CSS, and Recharts.

## Features

### 📊 Dashboard Tab
- **Fleet KPIs**: Total vehicles, vehicles idle, maintenance due, fleet health
- **Fuel Consumption Chart**: Line chart showing fuel consumption over time
- **Cost per KM Chart**: Bar chart displaying cost per kilometer by vehicle type
- **Active Alerts Table**: Real-time critical alerts with severity indicators

### 🚗 Vehicles Tab
- Vehicle list with search functionality
- Fuel level indicators with progress bars
- Active alerts for each vehicle
- VIN and vehicle ID display

### ⚙️ Operations Tab
- Real-time OBD-II parameter monitoring
- Customizable parameter selection (12+ metrics)
- Live data table with all vehicle telemetry:
  - Engine RPM, Load %, Throttle %
  - Vehicle Speed, Battery Voltage
  - Coolant Temp, IAT, MAP
  - Fuel Pressure, MAF, Fuel Rate
  - DEF Level (for diesel vehicles)

### 🚨 Alerts Tab
- Alert rule configuration interface
- Define custom alert rules with:
  - Parameter selection
  - Comparator operators (>, <, >=, <=, =)
  - Threshold values
  - Severity levels (Low, Medium, High, Critical)
  - Dwell time settings
- View currently triggering alerts
- Enable/disable rules dynamically

### 🔧 Maintenance Tab
- Maintenance schedule tracking
- Task prioritization (High, Medium, Low)
- Status indicators (Overdue, Upcoming, Completed)
- Due date tracking

## OBD-II Data Categories

The dashboard monitors comprehensive OBD-II parameters organized into:

1. **Vehicle Information**: VIN, ECU identification
2. **Engine Parameters**: RPM, load, throttle, torque, battery voltage
3. **Engine States**: Ignition status, engine operational modes
4. **Temperature Sensors**: Coolant, intake air
5. **Pressure Sensors**: Oil, intake manifold, boost
6. **Fuel System**: Fuel level, consumption rate, pressure, system status
7. **Emissions**: Catalyst temperature, O2 sensors
8. **Environment**: Ambient temperature, barometric pressure
9. **Diagnostics**: DTCs, MIL status, fault codes

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**:
The app will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Technology Stack

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **Lucide React**: Beautiful icon set

## Project Structure

```
obd_test/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx    # Main dashboard with KPIs and charts
│   │   ├── Vehicles.jsx     # Vehicle list view
│   │   ├── Operations.jsx   # Real-time OBD parameters
│   │   ├── Alerts.jsx       # Alert configuration
│   │   └── Maintenance.jsx  # Maintenance schedule
│   ├── data/
│   │   └── dummyData.js     # Mock OBD-II data generator
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Dummy Data

The application uses realistic dummy data to simulate:
- 3 vehicles (VAN-001, TRK-142, CAR-227)
- Real-time OBD-II parameters
- Active alerts with severity levels
- Maintenance schedules
- Fuel consumption trends
- Cost analytics

## Alert Severity Levels

- 🔴 **Critical**: Immediate action required (engine faults, oil pressure loss)
- 🟠 **High**: Schedule maintenance soon (battery low, high temperature)
- 🟡 **Medium**: Early warning (extended idle, efficiency deviation)
- ⚪ **Low**: Informational (sensor drift, refuel events)

## Customization

### Adding New OBD Parameters
Edit `src/data/dummyData.js` to add new vehicle parameters:

```javascript
export const generateOBDParameters = () => {
  return [
    {
      vehicle: 'VAN-001',
      // Add new parameters here
      newParameter: value
    }
  ];
};
```

### Creating New Alert Rules
Use the Alerts tab interface or modify `generateAlertRules()` in `dummyData.js`.

### Styling
The dark theme uses Tailwind CSS custom colors defined in `tailwind.config.js`:
- `dark-bg`: Main background (#0a0e1a)
- `dark-card`: Card background (#0f1629)
- `dark-border`: Border color (#1e293b)
- `dark-hover`: Hover state (#1a2332)

## Future Enhancements

- Real OBD-II device integration via Bluetooth/WiFi
- Backend API for data persistence
- User authentication and fleet management
- Driver behavior analytics
- Route optimization
- Predictive maintenance ML models
- Mobile app (React Native)
- Real-time WebSocket updates
- PDF report generation
- Multi-language support

## License

MIT

## Contact

For questions or support, please contact your fleet management team.


