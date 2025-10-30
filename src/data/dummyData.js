// Dummy OBD-II Data Generator for Fleet Management Dashboard

// Unified Health Index Calculation (0-100)
// Used for both individual vehicles and fleet average
const calculateHealthIndex = (vehicle) => {
  // 1. DTC Score (30%) - penalize active diagnostic trouble codes
  const dtcScore = Math.max(0, 100 - (vehicle.activeDTCs * 33));
  
  // 2. Maintenance Score (20%) - check for maintenance alerts
  const hasMaintenanceAlert = vehicle.alerts.some(alert => 
    alert.type.includes('Due') || 
    alert.type.includes('Overdue') || 
    alert.type.includes('Maintenance') ||
    alert.type.includes('Inspection')
  );
  const maintenanceScore = hasMaintenanceAlert ? 0 : 100;
  
  // 3. MPG Score (30%) - fuel efficiency (10-35 mpg range)
  // Higher MPG = better score
  const mpgScore = Math.min(100, Math.max(0, ((vehicle.avgFuelEfficiency - 10) / 25) * 100));
  
  // 4. Idle Time Score (20%) - lower idle percentage is better
  const idlePercent = vehicle.fuelConsumptionDaily > 0 
    ? (vehicle.fuelIdle / vehicle.fuelConsumptionDaily) * 100 
    : 0;
  const idleScore = Math.max(0, 100 - (idlePercent * 2)); // 50% idle = 0 score
  
  // Calculate weighted health index
  const healthIndex = Math.round(
    (dtcScore * 0.30) +
    (maintenanceScore * 0.20) +
    (mpgScore * 0.30) +
    (idleScore * 0.20)
  );
  
  return Math.min(100, Math.max(0, healthIndex));
};

export const generateVehicleData = () => {
  // Generate 100 vehicles with varied data
  const generateDummyVehicles = () => {
    const vehicles = [];
    const types = ['Van', 'Truck', 'Car'];
    const fuelTypes = ['Diesel', 'Gas', 'Hybrid'];
    const statuses = ['Active', 'Idle', 'In Service'];
    const alertTypes = [
      'Engine Fault (P0300)', 'Low Tire Pressure', 'Battery Low', 'DEF Low',
      'Oil Change Due', 'P0171 - System Lean', 'P0420 - Catalyst', 'Extended Idle',
      'High Engine Load', 'Coolant High', 'Brake Inspection Due'
    ];
    
    for (let i = 1; i <= 100; i++) {
      const type = types[i % 3];
      const fuelType = fuelTypes[i % 3];
      const status = i % 8 === 0 ? 'In Service' : i % 5 === 0 ? 'Idle' : 'Active';
      const alertCount = Math.floor(Math.random() * 3);
      const alerts = [];
      for (let j = 0; j < alertCount; j++) {
        alerts.push({
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)]
        });
      }
      
      const prefix = type === 'Van' ? 'VAN' : type === 'Truck' ? 'TRK' : 'CAR';
      
      const vehicleData = {
        id: `${prefix}-${String(i).padStart(3, '0')}`,
        vin: `1FTFW1EV${Math.floor(Math.random() * 10)}DFC${String(i).padStart(5, '0')}`,
        cameraSN: `CAM-${prefix.substring(0, 2)}-2023-${String(i).padStart(3, '0')}`,
        type,
        status,
        fuelType,
        fuelCostPerMile: parseFloat((0.24 + Math.random() * 0.24).toFixed(2)), // converted from km
        avgFuelEfficiency: parseFloat((14 + Math.random() * 19).toFixed(1)), // mpg (converted from km/L)
        fuelConsumptionDaily: parseFloat((status === 'In Service' ? 0 : 5 + Math.random() * 15).toFixed(1)),
        fuelMoving: parseFloat((status === 'In Service' ? 0 : 4 + Math.random() * 10).toFixed(1)),
        fuelIdle: parseFloat((status === 'Idle' ? 2 + Math.random() * 3 : Math.random() * 2).toFixed(1)),
        totalFuelCostDaily: parseFloat((status === 'In Service' ? 0 : 10 + Math.random() * 20).toFixed(2)),
        alerts,
        engineRPM: status === 'In Service' ? 0 : Math.floor(650 + Math.random() * 500),
        engineLoad: status === 'In Service' ? 0 : Math.floor(Math.random() * 50),
        engineTorque: status === 'In Service' ? 0 : Math.floor(50 + Math.random() * 200),
        batteryVoltage: parseFloat((11.8 + Math.random() * 1.5).toFixed(1)),
        coolantTemp: Math.floor(status === 'In Service' ? 25 : 75 + Math.random() * 25),
        oilPressure: status === 'In Service' ? 0 : Math.floor(35 + Math.random() * 15),
        fuelLevel: Math.floor(30 + Math.random() * 50),
        defLevel: fuelType === 'Diesel' ? Math.floor(5 + Math.random() * 50) : null,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: Math.floor(22 + Math.random() * 15),
      speedMph: status === 'Active' ? Math.floor(Math.random() * 50) : 0, // mph (converted from kmh)
      odometerMiles: Math.floor(6200 + Math.random() * 55900), // miles (converted from km)
      activeDTCs: alertCount,
      engineOilLife: Math.floor(30 + Math.random() * 70), // % remaining
      tirePressureFrontLeft: parseFloat((30 + Math.random() * 5).toFixed(1)), // PSI
      tirePressureFrontRight: parseFloat((30 + Math.random() * 5).toFixed(1)),
      tirePressureRearLeft: parseFloat((30 + Math.random() * 5).toFixed(1)),
      tirePressureRearRight: parseFloat((30 + Math.random() * 5).toFixed(1))
      };
      
      // Calculate health index using unified formula
      vehicleData.healthIndex = calculateHealthIndex(vehicleData);
      
      vehicles.push(vehicleData);
    }
    return vehicles;
  };

  const vehicles = generateDummyVehicles();
  
  // Keep some specific examples at the beginning for consistency
  const specificVehicles = [
    {
      id: 'VAN-001',
      vin: '1GCHK23D7PF123456',
      cameraSN: 'CAM-VN-2023-001',
      type: 'Van',
      status: 'Active',
      fuelType: 'Diesel',
      fuelCostPerMile: 0.39,
      avgFuelEfficiency: 20.0,
      fuelConsumptionDaily: 15.2,
      fuelMoving: 11.8,
      fuelIdle: 3.4,
      totalFuelCostDaily: 22.80,
      alerts: [
        { type: 'Engine Fault (P0300)', severity: 'Critical' },
        { type: 'Oil Change Due', severity: 'Medium' }
      ],
      // Detailed OBD parameters
      engineRPM: 920,
      engineLoad: 32,
      engineTorque: 145,
      batteryVoltage: 12.2,
      coolantTemp: 93,
      oilPressure: 45,
      fuelLevel: 58,
      defLevel: 35,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 31,
      speedMph: 24,
      odometerMiles: 28100,
      activeDTCs: 2,
      engineOilLife: 65,
      tirePressureFrontLeft: 32.5,
      tirePressureFrontRight: 32.8,
      tirePressureRearLeft: 31.9,
      tirePressureRearRight: 32.2
    },
    {
      id: 'TRK-142',
      vin: 'IFTSW21R08E899001',
      cameraSN: 'CAM-TK-2023-142',
      type: 'Truck',
      status: 'Idle',
      fuelType: 'Diesel',
      healthIndex: 58,
      fuelCostPerMile: 0.29,
      avgFuelEfficiency: 14.6,
      fuelConsumptionDaily: 8.3,
      fuelMoving: 5.1,
      fuelIdle: 3.2,
      totalFuelCostDaily: 12.45,
      alerts: [
        { type: 'Low Tire Pressure', severity: 'High' },
        { type: 'DEF Low', severity: 'High' }
      ],
      engineRPM: 0,
      engineLoad: 0,
      engineTorque: 0,
      batteryVoltage: 11.8,
      coolantTemp: 40,
      oilPressure: 0,
      fuelLevel: 46,
      defLevel: 8,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 22,
      speedMph: 0,
      odometerMiles: 48750,
      activeDTCs: 2,
      engineOilLife: 45,
      tirePressureFrontLeft: 28.5,
      tirePressureFrontRight: 29.0,
      tirePressureRearLeft: 28.2,
      tirePressureRearRight: 28.8
    },
    {
      id: 'CAR-227',
      vin: 'WVWZZZ1JZW000001',
      cameraSN: 'CAM-CR-2023-227',
      type: 'Car',
      status: 'Active',
      fuelType: 'Gas',
      healthIndex: 78,
      fuelCostPerMile: 0.42,
      avgFuelEfficiency: 23.1,
      fuelConsumptionDaily: 12.5,
      fuelMoving: 10.2,
      fuelIdle: 2.3,
      totalFuelCostDaily: 18.75,
      alerts: [
        { type: 'Battery Low', severity: 'Medium' }
      ],
      engineRPM: 650,
      engineLoad: 8,
      engineTorque: 65,
      batteryVoltage: 12.1,
      coolantTemp: 88,
      oilPressure: 38,
      fuelLevel: 53,
      defLevel: null,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 29,
      speedMph: 0,
      odometerMiles: 20000,
      activeDTCs: 1,
      engineOilLife: 78,
      tirePressureFrontLeft: 33.2,
      tirePressureFrontRight: 33.5,
      tirePressureRearLeft: 32.8,
      tirePressureRearRight: 33.0
    },
    {
      id: 'VAN-003',
      vin: '1FTFW1ET5DFC10312',
      cameraSN: 'CAM-VN-2023-003',
      type: 'Van',
      status: 'In Service',
      fuelType: 'Gas',
      healthIndex: 45,
      fuelCostPerMile: 0.35,
      avgFuelEfficiency: 18.6,
      fuelConsumptionDaily: 0,
      fuelMoving: 0,
      fuelIdle: 0,
      totalFuelCostDaily: 0,
      alerts: [
        { type: 'Scheduled Maintenance', severity: 'Low' }
      ],
      engineRPM: 0,
      engineLoad: 0,
      engineTorque: 0,
      batteryVoltage: 12.4,
      coolantTemp: 25,
      oilPressure: 0,
      fuelLevel: 72,
      defLevel: null,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 22,
      speedMph: 0,
      odometerMiles: 35350,
      activeDTCs: 1,
      engineOilLife: 35,
      tirePressureFrontLeft: 32.0,
      tirePressureFrontRight: 32.3,
      tirePressureRearLeft: 31.7,
      tirePressureRearRight: 32.1
    },
    {
      id: 'CAR-156',
      vin: '5YJSA1E14HF123789',
      cameraSN: 'CAM-CR-2023-156',
      type: 'Car',
      status: 'Active',
      fuelType: 'Hybrid',
      healthIndex: 89,
      fuelCostPerMile: 0.24,
      avgFuelEfficiency: 33.4,
      fuelConsumptionDaily: 8.7,
      fuelMoving: 7.8,
      fuelIdle: 0.9,
      totalFuelCostDaily: 13.05,
      alerts: [],
      engineRPM: 1200,
      engineLoad: 25,
      engineTorque: 95,
      batteryVoltage: 13.2,
      coolantTemp: 82,
      oilPressure: 42,
      fuelLevel: 68,
      defLevel: null,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 28,
      speedMph: 28,
      odometerMiles: 7675,
      activeDTCs: 0,
      engineOilLife: 92,
      tirePressureFrontLeft: 34.1,
      tirePressureFrontRight: 34.2,
      tirePressureRearLeft: 33.8,
      tirePressureRearRight: 34.0
    },
    {
      id: 'TRK-089',
      vin: '1HGBH41JXMN109186',
      cameraSN: 'CAM-TK-2023-089',
      type: 'Truck',
      status: 'Active',
      fuelType: 'Diesel',
      healthIndex: 65,
      fuelCostPerMile: 0.31,
      avgFuelEfficiency: 16.7,
      fuelConsumptionDaily: 18.5,
      fuelMoving: 14.2,
      fuelIdle: 4.3,
      totalFuelCostDaily: 27.75,
      alerts: [
        { type: 'P0191 - Fuel Pressure', severity: 'Critical' },
        { type: 'DEF Low', severity: 'High' }
      ],
      engineRPM: 1100,
      engineLoad: 45,
      engineTorque: 280,
      batteryVoltage: 12.8,
      coolantTemp: 96,
      oilPressure: 48,
      fuelLevel: 42,
      defLevel: 8,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 35,
      speedMph: 40,
      odometerMiles: 55450,
      activeDTCs: 2,
      engineOilLife: 52,
      tirePressureFrontLeft: 31.8,
      tirePressureFrontRight: 32.1,
      tirePressureRearLeft: 31.5,
      tirePressureRearRight: 31.9
    },
    {
      id: 'VAN-045',
      vin: '2HKRL18H8XH123456',
      cameraSN: 'CAM-VN-2023-045',
      type: 'Van',
      status: 'Active',
      fuelType: 'Gas',
      healthIndex: 71,
      fuelCostPerMile: 0.37,
      avgFuelEfficiency: 20.7,
      fuelConsumptionDaily: 14.1,
      fuelMoving: 11.5,
      fuelIdle: 2.6,
      totalFuelCostDaily: 21.15,
      alerts: [
        { type: 'P0101 - MAF Circuit', severity: 'High' }
      ],
      engineRPM: 850,
      engineLoad: 28,
      engineTorque: 125,
      batteryVoltage: 12.3,
      coolantTemp: 91,
      oilPressure: 44,
      fuelLevel: 61,
      defLevel: null,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 30,
      speedMph: 52,
      odometerMiles: 54780,
      activeDTCs: 1,
      engineOilLife: 68,
      tirePressureFrontLeft: 32.7,
      tirePressureFrontRight: 32.9,
      tirePressureRearLeft: 32.4,
      tirePressureRearRight: 32.6
    },
    {
      id: 'CAR-334',
      vin: 'JH4KA7650NC123456',
      cameraSN: 'CAM-CR-2023-334',
      type: 'Car',
      status: 'Active',
      fuelType: 'Gas',
      healthIndex: 82,
      fuelCostPerMile: 0.34,
      avgFuelEfficiency: 24.0,
      fuelConsumptionDaily: 11.3,
      fuelMoving: 9.8,
      fuelIdle: 1.5,
      totalFuelCostDaily: 16.95,
      alerts: [
        { type: 'P0340 - Camshaft Pos', severity: 'Medium' }
      ],
      engineRPM: 720,
      engineLoad: 18,
      engineTorque: 78,
      batteryVoltage: 12.5,
      coolantTemp: 86,
      oilPressure: 40,
      fuelLevel: 58,
      defLevel: null,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 27,
      speedMph: 48,
      odometerMiles: 28900,
      activeDTCs: 1,
      engineOilLife: 81,
      tirePressureFrontLeft: 33.5,
      tirePressureFrontRight: 33.7,
      tirePressureRearLeft: 33.2,
      tirePressureRearRight: 33.4
    },
    {
      id: 'VAN-078',
      vin: '1FTFW1EV9DFC10312',
      cameraSN: 'CAM-VN-2023-078',
      type: 'Van',
      status: 'Idle',
      fuelType: 'Diesel',
      healthIndex: 68,
      fuelCostPerMile: 0.35,
      avgFuelEfficiency: 19.3,
      fuelConsumptionDaily: 2.1,
      fuelMoving: 0,
      fuelIdle: 2.1,
      totalFuelCostDaily: 3.15,
      alerts: [
        { type: 'Extended Idle', severity: 'Medium' }
      ],
      engineRPM: 750,
      engineLoad: 5,
      engineTorque: 15,
      batteryVoltage: 12.0,
      coolantTemp: 78,
      oilPressure: 35,
      fuelLevel: 45,
      defLevel: 42,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 24,
      speedMph: 0,
      odometerMiles: 67340,
      activeDTCs: 1,
      engineOilLife: 42,
      tirePressureFrontLeft: 31.2,
      tirePressureFrontRight: 31.5,
      tirePressureRearLeft: 30.9,
      tirePressureRearRight: 31.3
    },
    {
      id: 'TRK-201',
      vin: '1HGCM82633A004352',
      cameraSN: 'CAM-TK-2023-201',
      type: 'Truck',
      status: 'Active',
      fuelType: 'Diesel',
      healthIndex: 74,
      fuelCostPerMile: 0.27,
      avgFuelEfficiency: 17.6,
      fuelConsumptionDaily: 16.8,
      fuelMoving: 13.9,
      fuelIdle: 2.9,
      totalFuelCostDaily: 25.20,
      alerts: [
        { type: 'Tire Rotation Due', severity: 'Medium' }
      ],
      engineRPM: 980,
      engineLoad: 38,
      engineTorque: 245,
      batteryVoltage: 12.6,
      coolantTemp: 94,
      oilPressure: 46,
      fuelLevel: 55,
      defLevel: 28,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 32,
      speedMph: 58,
      odometerMiles: 92180,
      activeDTCs: 1,
      engineOilLife: 58,
      tirePressureFrontLeft: 32.3,
      tirePressureFrontRight: 32.6,
      tirePressureRearLeft: 32.0,
      tirePressureRearRight: 32.4
    },
    {
      id: 'CAR-445',
      vin: 'WBADT43452G123456',
      cameraSN: 'CAM-CR-2023-445',
      type: 'Car',
      status: 'Active',
      fuelType: 'Gas',
      healthIndex: 85,
      fuelCostPerMile: 0.32,
      avgFuelEfficiency: 27.0,
      fuelConsumptionDaily: 9.8,
      fuelMoving: 8.9,
      fuelIdle: 0.9,
      totalFuelCostDaily: 14.70,
      alerts: [],
      engineRPM: 680,
      engineLoad: 15,
      engineTorque: 68,
      batteryVoltage: 12.7,
      coolantTemp: 84,
      oilPressure: 41,
      fuelLevel: 72,
      defLevel: null,
      ambientTemp: 22,
      barometricPressure: 101.3,
      intakeAirTemp: 26,
      speedMph: 42,
      odometerMiles: 18650,
      activeDTCs: 0,
      engineOilLife: 88,
      tirePressureFrontLeft: 33.8,
      tirePressureFrontRight: 34.0,
      tirePressureRearLeft: 33.5,
      tirePressureRearRight: 33.7
    }
  ];

  // Calculate health index for all specific vehicles
  const specificVehiclesWithHealth = specificVehicles.map(v => ({
    ...v,
    healthIndex: calculateHealthIndex(v)
  }));
  
  return [...specificVehiclesWithHealth, ...vehicles.slice(specificVehicles.length)];
};

export const generateOBDParameters = () => {
  return [
    {
      vehicle: 'VAN-001',
      vin: '1GCHK23D7PF123456',
      rpm: 920,
      loadPercent: 32,
      throttlePercent: 14,
      speedMph: 38,
      batteryV: 12.2,
      coolantC: 93,
      iatC: 31,
      mapKPa: 72,
      fuelPKPa: 380,
      mafGps: 18.4,
      fuelRateLph: 3.2,
      defPercent: null
    },
    {
      vehicle: 'TRK-142',
      vin: 'IFTSW21R08E899001',
      rpm: 0,
      loadPercent: 0,
      throttlePercent: 0,
      speedMph: 0,
      batteryV: 11.8,
      coolantC: 40,
      iatC: 22,
      mapKPa: 101,
      fuelPKPa: 420,
      mafGps: 2.1,
      fuelRateLph: 0.6,
      defPercent: 22
    },
    {
      vehicle: 'CAR-227',
      vin: 'WVWZZZ1JZW000001',
      rpm: 650,
      loadPercent: 8,
      throttlePercent: 3,
      speedMph: 0,
      batteryV: 12.1,
      coolantC: 88,
      iatC: 29,
      mapKPa: 32,
      fuelPKPa: 340,
      mafGps: 2.8,
      fuelRateLph: 0.9,
      defPercent: null
    }
  ];
};

export const generateAlerts = () => {
  return [
    {
      vehicle: 'VAN-001',
      alert: 'Engine Fault (P0300)',
      severity: 'Critical'
    },
    {
      vehicle: 'TRK-142',
      alert: 'Low Tire Pressure',
      severity: 'High'
    },
    {
      vehicle: 'CAR-227',
      alert: 'Battery Low',
      severity: 'Medium'
    }
  ];
};

export const generateMaintenanceSchedule = () => {
  return [
    {
      task: 'Oil Change',
      vehicle: 'VAN-001',
      dueDate: '15/03/2024',
      priority: 'High',
      status: 'Overdue'
    },
    {
      task: 'Tire Rotation',
      vehicle: 'CAR-227',
      dueDate: '20/04/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Brake Inspection',
      vehicle: 'TRK-142',
      dueDate: '25/04/2024',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      task: 'Air Filter Change',
      vehicle: 'VAN-003',
      dueDate: '28/04/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'DEF System Service',
      vehicle: 'TRK-142',
      dueDate: '05/05/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Coolant Flush',
      vehicle: 'CAR-156',
      dueDate: '10/05/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Transmission Service',
      vehicle: 'VAN-001',
      dueDate: '15/05/2024',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      task: 'Battery Check',
      vehicle: 'CAR-227',
      dueDate: '18/05/2024',
      priority: 'Low',
      status: 'Upcoming'
    },
    {
      task: 'Wheel Alignment',
      vehicle: 'TRK-089',
      dueDate: '22/05/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Fuel Filter Change',
      vehicle: 'VAN-045',
      dueDate: '25/05/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Spark Plug Replacement',
      vehicle: 'CAR-227',
      dueDate: '30/05/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Serpentine Belt',
      vehicle: 'VAN-001',
      dueDate: '02/06/2024',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      task: 'Cabin Air Filter',
      vehicle: 'CAR-156',
      dueDate: '05/06/2024',
      priority: 'Low',
      status: 'Upcoming'
    },
    {
      task: 'Differential Service',
      vehicle: 'TRK-142',
      dueDate: '08/06/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Power Steering Fluid',
      vehicle: 'VAN-003',
      dueDate: '12/06/2024',
      priority: 'Low',
      status: 'Upcoming'
    },
    {
      task: 'Wiper Blade Replacement',
      vehicle: 'CAR-334',
      dueDate: '15/06/2024',
      priority: 'Low',
      status: 'Upcoming'
    },
    {
      task: 'Timing Belt',
      vehicle: 'VAN-045',
      dueDate: '18/06/2024',
      priority: 'Critical',
      status: 'Upcoming'
    },
    {
      task: 'Shock Absorbers',
      vehicle: 'TRK-089',
      dueDate: '22/06/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Ball Joints Inspection',
      vehicle: 'CAR-445',
      dueDate: '25/06/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Exhaust System Check',
      vehicle: 'VAN-078',
      dueDate: '28/06/2024',
      priority: 'Low',
      status: 'Upcoming'
    },
    {
      task: 'Engine Air Filter',
      vehicle: 'TRK-201',
      dueDate: '01/07/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'PCV Valve',
      vehicle: 'CAR-227',
      dueDate: '05/07/2024',
      priority: 'Low',
      status: 'Upcoming'
    },
    {
      task: 'Drive Belt Tensioner',
      vehicle: 'VAN-001',
      dueDate: '08/07/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Radiator Hoses',
      vehicle: 'TRK-142',
      dueDate: '12/07/2024',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      task: 'Thermostat Check',
      vehicle: 'CAR-156',
      dueDate: '15/07/2024',
      priority: 'Low',
      status: 'Upcoming'
    },
    {
      task: 'Fuel Injector Cleaning',
      vehicle: 'VAN-003',
      dueDate: '18/07/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Steering Linkage',
      vehicle: 'TRK-089',
      dueDate: '22/07/2024',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      task: 'U-Joints Inspection',
      vehicle: 'CAR-334',
      dueDate: '25/07/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Catalytic Converter',
      vehicle: 'VAN-078',
      dueDate: '28/07/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Oxygen Sensors',
      vehicle: 'TRK-201',
      dueDate: '01/08/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'Turbo Inspection',
      vehicle: 'TRK-089',
      dueDate: '05/08/2024',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      task: 'EGR Valve Cleaning',
      vehicle: 'VAN-001',
      dueDate: '08/08/2024',
      priority: 'Medium',
      status: 'Upcoming'
    },
    {
      task: 'DPF Regeneration',
      vehicle: 'TRK-142',
      dueDate: '12/08/2024',
      priority: 'High',
      status: 'Upcoming'
    }
  ];
};

export const generateAlertRules = () => {
  return [
    {
      id: 1,
      enabled: true,
      name: 'Overheat',
      param: 'Coolant (°C)',
      comparator: '>',
      threshold: 110,
      severity: 'Critical',
      dwell: 5
    },
    {
      id: 2,
      enabled: true,
      name: 'Low Battery',
      param: 'Battery (V)',
      comparator: '<',
      threshold: 12,
      severity: 'High',
      dwell: 300
    }
  ];
};

export const generateCurrentlyTriggering = () => {
  return [
    {
      vehicle: 'TRK-142',
      rule: 'Low Battery',
      severity: 'High'
    }
  ];
};

export const generateFuelConsumptionData = () => {
  return [
    { date: 'Apr 1', value: 1.6 },
    { date: 'Apr 4', value: 2.8 },
    { date: 'Apr 7', value: 3.1 },
    { date: 'Apr 10', value: 2.4 },
    { date: 'Apr 13', value: 2.6 }
  ];
};

export const generateCostPerMileData = () => {
  return [
    { type: 'Van', cost: 0.39 },
    { type: 'Truck', cost: 0.29 },
    { type: 'Car', cost: 0.42 }
  ];
};

export const generateFuelIdleVsMovingData = () => {
  return [
    { category: 'Moving', fuel: 32.5, percentage: 71.9 },
    { category: 'Idle', fuel: 12.7, percentage: 28.1 }
  ];
};

export const generateFuelEfficiencyTrendData = () => {
  return [
    { date: 'Apr 1', efficiency: 8.2, baseline: 9.0 },
    { date: 'Apr 4', efficiency: 8.7, baseline: 9.0 },
    { date: 'Apr 7', efficiency: 8.5, baseline: 9.0 },
    { date: 'Apr 10', efficiency: 8.3, baseline: 9.0 },
    { date: 'Apr 13', efficiency: 8.6, baseline: 9.0 }
  ];
};

export const generateDailyFuelCostData = () => {
  return [
    { date: 'Mon', cost: 62.5 },
    { date: 'Tue', cost: 71.2 },
    { date: 'Wed', cost: 68.9 },
    { date: 'Thu', cost: 65.3 },
    { date: 'Fri', cost: 73.4 },
    { date: 'Sat', cost: 55.8 },
    { date: 'Sun', cost: 41.7 }
  ];
};

export const generateAlertsOverTimeData = () => {
  return [
    { date: 'Sep 21', critical: 0, high: 1, medium: 1, low: 0 },
    { date: 'Sep 28', critical: 1, high: 0, medium: 2, low: 1 },
    { date: 'Oct 5', critical: 0, high: 2, medium: 1, low: 0 },
    { date: 'Oct 12', critical: 1, high: 1, medium: 0, low: 2 },
    { date: 'Oct 19', critical: 2, high: 2, medium: 1, low: 1 }
  ];
};

export const generateDTCDetails = (vehicleId) => {
  const dtcDatabase = {
    'VAN-001': [
      { code: 'P0300', description: 'Random/Multiple Cylinder Misfire Detected', severity: 'Critical', status: 'Active', timestamp: '2 hours ago' },
      { code: 'P0171', description: 'System Too Lean (Bank 1)', severity: 'Medium', status: 'Active', timestamp: '5 hours ago' }
    ],
    'TRK-142': [
      { code: 'C2120', description: 'Low Tire Pressure Warning', severity: 'High', status: 'Active', timestamp: '1 hour ago' },
      { code: 'P0401', description: 'DEF System Low Flow', severity: 'High', status: 'Active', timestamp: '3 hours ago' }
    ],
    'CAR-227': [
      { code: 'P0562', description: 'System Voltage Low', severity: 'Medium', status: 'Active', timestamp: '30 min ago' }
    ],
    'VAN-003': [
      { code: 'B1234', description: 'Service Reminder', severity: 'Low', status: 'Pending', timestamp: '1 day ago' }
    ],
    'CAR-156': []
  };
  
  return dtcDatabase[vehicleId] || [];
};

export const generateFleetMetrics = () => {
  // Get all vehicles to calculate fleet health
  const allVehicles = generateVehicleData();
  const fleetHealthIndex = Math.round(
    allVehicles.reduce((sum, v) => sum + v.healthIndex, 0) / allVehicles.length
  );
  
  return {
    // LEVEL 0 - Fleet Overview
    totalVehicles: 3,
    vehiclesActive: 2,
    vehiclesIdle: 1,
    idlePercentage: 33.3,
    faultsOverTime: {
      current: 3,
      previous: 2,
      percentChange: 50
    },
    maintenanceDue: 2,
    maintenanceOverdue: 1,
    maintenancePercentage: 33.3,
    
    // LEVEL 1 - Core Fleet KPIs
    fleetHealthIndex,
    fuelCostPerMile: 0.37, // $/mile (converted from 0.23 $/km)
    avgFuelEfficiency: 20.0, // mpg (converted from 8.5 km/L)
    avgFuelEfficiencyL100km: 11.8, // L/100km (kept for reference)
    totalFuelConsumptionDaily: 45.2, // L/day
    fuelConsumptionMoving: 32.5, // L
    fuelConsumptionIdle: 12.7, // L
    idleFuelPercentage: 28.1,
    totalFuelCostDaily: 67.8, // $ per day
    fuelCostTrip: 22.6, // $ per trip average
    
    // Baseline comparisons
    baselineFuelEfficiency: 21.2, // mpg (converted from 9.0 km/L)
    baselineCostPerMile: 0.32, // $/mile (converted from 0.20 $/km)
    targetIdlePercentage: 15,
    fleetAverageFuelEfficiency: 20.0 // mpg
  };
};

