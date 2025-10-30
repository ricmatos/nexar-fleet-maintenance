import React, { useState } from 'react';
import { AlertTriangle, Bell, Calendar, HelpCircle, X, Settings, TrendingUp, Search, Filter, CheckCircle, Download, ChevronDown, ChevronRight, Save } from 'lucide-react';
import { generateMaintenanceSchedule } from '../data/dummyData';

const Alerts = () => {
  const [showConditionHelp, setShowConditionHelp] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [maintenanceItems, setMaintenanceItems] = useState(generateMaintenanceSchedule());
  const [alertFeedPage, setAlertFeedPage] = useState(1);
  const [vehiclesPage, setVehiclesPage] = useState(1);
  const [maintenancePage, setMaintenancePage] = useState(1);
  const itemsPerPage = 20;
  const [expandedCategories, setExpandedCategories] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalRules, setOriginalRules] = useState(null);

  // DTC-related alert feed for last 7 days (71 examples)
  const alertFeed = [
    { id: 1, vehicle: 'VAN-001', type: 'P0300 - Random Misfire', severity: 'Critical', timestamp: '2h ago' },
    { id: 2, vehicle: 'TRK-142', type: 'P0401 - DEF Low Flow', severity: 'High', timestamp: '3h ago' },
    { id: 3, vehicle: 'CAR-227', type: 'P0562 - Low Voltage', severity: 'Medium', timestamp: '5h ago' },
    { id: 4, vehicle: 'VAN-001', type: 'P0171 - System Lean', severity: 'Medium', timestamp: '8h ago' },
    { id: 5, vehicle: 'TRK-142', type: 'C2120 - TPMS Warning', severity: 'High', timestamp: '10h ago' },
    { id: 6, vehicle: 'CAR-227', type: 'Extended Idle', severity: 'Low', timestamp: '12h ago' },
    { id: 7, vehicle: 'VAN-001', type: 'P0128 - Thermostat', severity: 'Low', timestamp: '14h ago' },
    { id: 8, vehicle: 'TRK-142', type: 'High Engine Load', severity: 'High', timestamp: '16h ago' },
    { id: 9, vehicle: 'VAN-003', type: 'P0420 - Catalyst', severity: 'Medium', timestamp: '18h ago' },
    { id: 10, vehicle: 'CAR-156', type: 'Battery Charging', severity: 'Medium', timestamp: '20h ago' },
    { id: 11, vehicle: 'VAN-045', type: 'P0101 - MAF Circuit', severity: 'High', timestamp: '22h ago' },
    { id: 12, vehicle: 'TRK-089', type: 'P0191 - Fuel Pressure', severity: 'Critical', timestamp: '1d ago' },
    { id: 13, vehicle: 'CAR-334', type: 'P0340 - Camshaft', severity: 'Medium', timestamp: '1d ago' },
    { id: 14, vehicle: 'VAN-001', type: 'Oil Overheat', severity: 'High', timestamp: '1d ago' },
    { id: 15, vehicle: 'TRK-142', type: 'Brake Wear', severity: 'Medium', timestamp: '1d ago' },
    { id: 16, vehicle: 'VAN-078', type: 'Extended Idle', severity: 'Medium', timestamp: '1d ago' },
    { id: 17, vehicle: 'TRK-201', type: 'Tire Pressure', severity: 'High', timestamp: '1d ago' },
    { id: 18, vehicle: 'CAR-445', type: 'P0506 - Idle Low', severity: 'Low', timestamp: '1d ago' },
    { id: 19, vehicle: 'VAN-001', type: 'Coolant High', severity: 'High', timestamp: '2d ago' },
    { id: 20, vehicle: 'TRK-142', type: 'DEF Quality', severity: 'Medium', timestamp: '2d ago' },
    { id: 21, vehicle: 'CAR-227', type: 'P0455 - EVAP Leak', severity: 'Medium', timestamp: '2d ago' },
    { id: 22, vehicle: 'VAN-003', type: 'P0133 - O2 Sensor', severity: 'Low', timestamp: '2d ago' },
    { id: 23, vehicle: 'CAR-156', type: 'Charging System', severity: 'Medium', timestamp: '2d ago' },
    { id: 24, vehicle: 'TRK-089', type: 'Turbo Boost', severity: 'High', timestamp: '2d ago' },
    { id: 25, vehicle: 'VAN-045', type: 'P0171 - System Lean', severity: 'Medium', timestamp: '2d ago' },
    { id: 26, vehicle: 'CAR-334', type: 'ABS Warning', severity: 'High', timestamp: '2d ago' },
    { id: 27, vehicle: 'VAN-078', type: 'Fuel Level Low', severity: 'Low', timestamp: '3d ago' },
    { id: 28, vehicle: 'TRK-201', type: 'P0299 - Turbo Underboost', severity: 'Medium', timestamp: '3d ago' },
    { id: 29, vehicle: 'CAR-445', type: 'P0442 - EVAP Small Leak', severity: 'Low', timestamp: '3d ago' },
    { id: 30, vehicle: 'VAN-001', type: 'P0507 - Idle High', severity: 'Low', timestamp: '3d ago' },
    { id: 31, vehicle: 'TRK-142', type: 'Regeneration Needed', severity: 'Medium', timestamp: '3d ago' },
    { id: 32, vehicle: 'CAR-227', type: 'P0171 - Lean Condition', severity: 'Medium', timestamp: '3d ago' },
    { id: 33, vehicle: 'VAN-003', type: 'IAT High', severity: 'Low', timestamp: '3d ago' },
    { id: 34, vehicle: 'CAR-156', type: 'P0135 - O2 Heater', severity: 'Low', timestamp: '3d ago' },
    { id: 35, vehicle: 'TRK-089', type: 'EGR Flow', severity: 'Medium', timestamp: '3d ago' },
    { id: 36, vehicle: 'VAN-045', type: 'P0174 - System Lean B2', severity: 'Medium', timestamp: '4d ago' },
    { id: 37, vehicle: 'CAR-334', type: 'Knock Sensor', severity: 'Low', timestamp: '4d ago' },
    { id: 38, vehicle: 'VAN-078', type: 'P0711 - Trans Temp', severity: 'High', timestamp: '4d ago' },
    { id: 39, vehicle: 'TRK-201', type: 'Coolant Level', severity: 'Medium', timestamp: '4d ago' },
    { id: 40, vehicle: 'CAR-445', type: 'MAP Sensor', severity: 'Medium', timestamp: '4d ago' },
    { id: 41, vehicle: 'VAN-001', type: 'P0301 - Cyl 1 Misfire', severity: 'Critical', timestamp: '4d ago' },
    { id: 42, vehicle: 'TRK-142', type: 'Air Filter Clogged', severity: 'Low', timestamp: '4d ago' },
    { id: 43, vehicle: 'CAR-227', type: 'P0443 - EVAP Purge', severity: 'Low', timestamp: '4d ago' },
    { id: 44, vehicle: 'VAN-003', type: 'Fuel Trim', severity: 'Low', timestamp: '5d ago' },
    { id: 45, vehicle: 'CAR-156', type: 'P0172 - Rich Condition', severity: 'Medium', timestamp: '5d ago' },
    { id: 46, vehicle: 'TRK-089', type: 'Boost Pressure', severity: 'High', timestamp: '5d ago' },
    { id: 47, vehicle: 'VAN-045', type: 'P0134 - O2 Circuit', severity: 'Low', timestamp: '5d ago' },
    { id: 48, vehicle: 'CAR-334', type: 'Throttle Position', severity: 'Medium', timestamp: '5d ago' },
    { id: 49, vehicle: 'VAN-078', type: 'P0725 - Speed Sensor', severity: 'Low', timestamp: '5d ago' },
    { id: 50, vehicle: 'TRK-201', type: 'Injector Circuit', severity: 'High', timestamp: '5d ago' },
    { id: 51, vehicle: 'CAR-445', type: 'P0500 - VSS Malfunction', severity: 'Medium', timestamp: '5d ago' },
    { id: 52, vehicle: 'VAN-001', type: 'Fuel Pressure', severity: 'High', timestamp: '6d ago' },
    { id: 53, vehicle: 'TRK-142', type: 'P0405 - EGR Sensor', severity: 'Low', timestamp: '6d ago' },
    { id: 54, vehicle: 'CAR-227', type: 'P0113 - IAT High', severity: 'Low', timestamp: '6d ago' },
    { id: 55, vehicle: 'VAN-003', type: 'Accelerator Pedal', severity: 'Low', timestamp: '6d ago' },
    { id: 56, vehicle: 'CAR-156', type: 'P0325 - Knock Sensor', severity: 'Medium', timestamp: '6d ago' },
    { id: 57, vehicle: 'TRK-089', type: 'Exhaust Temp High', severity: 'High', timestamp: '6d ago' },
    { id: 58, vehicle: 'VAN-045', type: 'P0335 - Crankshaft', severity: 'Critical', timestamp: '6d ago' },
    { id: 59, vehicle: 'CAR-334', type: 'Cooling Fan', severity: 'Low', timestamp: '6d ago' },
    { id: 60, vehicle: 'VAN-078', type: 'P0711 - Trans Temp', severity: 'Medium', timestamp: '6d ago' },
    { id: 61, vehicle: 'TRK-201', type: 'Glow Plug', severity: 'Low', timestamp: '6d ago' },
    { id: 62, vehicle: 'CAR-445', type: 'P0141 - O2 Heater B1S2', severity: 'Low', timestamp: '6d ago' },
    { id: 63, vehicle: 'VAN-001', type: 'Idle Control', severity: 'Low', timestamp: '7d ago' },
    { id: 64, vehicle: 'TRK-142', type: 'P0403 - EGR Control', severity: 'Medium', timestamp: '7d ago' },
    { id: 65, vehicle: 'CAR-227', type: 'P0420 - Catalyst B1', severity: 'Medium', timestamp: '7d ago' },
    { id: 66, vehicle: 'VAN-003', type: 'Vacuum Leak', severity: 'Low', timestamp: '7d ago' },
    { id: 67, vehicle: 'CAR-156', type: 'Hybrid Battery', severity: 'High', timestamp: '7d ago' },
    { id: 68, vehicle: 'TRK-089', type: 'Aftertreatment', severity: 'Medium', timestamp: '7d ago' },
    { id: 69, vehicle: 'VAN-045', type: 'P0505 - Idle Control', severity: 'Low', timestamp: '7d ago' },
    { id: 70, vehicle: 'CAR-334', type: 'P0700 - Trans Control', severity: 'Medium', timestamp: '7d ago' },
    { id: 71, vehicle: 'VAN-078', type: 'P0750 - Shift Solenoid', severity: 'High', timestamp: '7d ago' }
  ];

  // Vehicles ranked by alert count (50 examples)
  const generateVehicleAlerts = () => {
    const vehicles = [];
    for (let i = 1; i <= 50; i++) {
      const types = ['VAN', 'TRK', 'CAR'];
      const type = types[i % 3];
      const alertCount = Math.max(1, Math.floor(Math.random() * 6));
      const severities = ['Critical', 'High', 'Medium', 'Low'];
      const alertNames = ['P0300 Misfire', 'DEF Low', 'TPMS', 'Battery', 'Coolant', 'Oil Pressure', 'MAF', 'Catalyst'];
      
      const alerts = [];
      for (let j = 0; j < alertCount; j++) {
        alerts.push({
          name: alertNames[j % alertNames.length],
          severity: severities[Math.floor(Math.random() * severities.length)]
        });
      }
      
      vehicles.push({
        vehicle: `${type}-${String(i).padStart(3, '0')}`,
        alertCount,
        topSeverity: alerts[0].severity,
        allAlerts: alerts
      });
    }
    return vehicles.sort((a, b) => b.alertCount - a.alertCount);
  };
  
  const vehiclesByAlerts = generateVehicleAlerts();

  // Combined alert and maintenance rules
  const [combinedRules, setCombinedRules] = useState([
    // Engine RPM Alerts
    { id: 1, type: 'Alert', enabled: true, category: 'Engine RPM', name: 'High RPM (Over-rev)', condition: '> 4000 RPM for > 5s', threshold1: 4000, unit1: 'RPM', threshold2: 5, unit2: 's', severity: 'Critical', pid: '01-0C', useCase: 'Detect over-rev state' },
    { id: 2, type: 'Alert', enabled: true, category: 'Engine RPM', name: 'Extended Idle', condition: '< 1000 RPM for > 600s & Speed = 0', threshold1: 1000, unit1: 'RPM', threshold2: 600, unit2: 's', severity: 'Medium', pid: '01-0C, 01-0D', useCase: 'Detect idle/run state' },
    
    // Engine Load Alerts
    { id: 4, type: 'Alert', enabled: true, category: 'Engine Load', name: 'High Engine Load (30s)', condition: '> 90% for > 30s', threshold1: 90, unit1: '%', threshold2: 30, unit2: 's', severity: 'High', pid: '01-04', useCase: 'Performance and overuse' },
    { id: 5, type: 'Alert', enabled: false, category: 'Engine Load', name: 'PTO Misuse', condition: 'Speed = 0 and Load > 30%', threshold1: 30, unit1: '%', threshold2: 60, unit2: 's', severity: 'Medium', pid: '01-04, 01-0D', useCase: 'PTO detection' },
    
    // Engine Torque Alerts
    { id: 6, type: 'Alert', enabled: false, category: 'Engine Torque', name: 'Over-Torque Event', condition: 'Torque > OEM limit for > 5s', threshold1: 500, unit1: 'Nm', threshold2: 5, unit2: 's', severity: 'Critical', pid: '0x61-0x64', useCase: 'Mechanical stress' },
    { id: 7, type: 'Alert', enabled: false, category: 'Engine Torque', name: 'PTO Load Check', condition: 'Speed = 0 and Torque > 30%', threshold1: 30, unit1: '%', threshold2: 60, unit2: 's', severity: 'Medium', pid: '0x61-0x64, 01-0D', useCase: 'Power analytics' },
    
    // Battery Voltage Alerts
    { id: 8, type: 'Alert', enabled: true, category: 'Battery Voltage', name: 'Charging Fault', condition: '< 13.0V (Running)', threshold1: 13, unit1: 'V', threshold2: 10, unit2: 's', severity: 'High', pid: '01-42', useCase: 'Alternator issue' },
    { id: 9, type: 'Alert', enabled: true, category: 'Battery Voltage', name: 'Overvoltage', condition: '> 15.5V', threshold1: 15.5, unit1: 'V', threshold2: 5, unit2: 's', severity: 'Critical', pid: '01-42', useCase: 'Charging fault' },
    { id: 10, type: 'Alert', enabled: true, category: 'Battery Voltage', name: 'Low Voltage (Discharge)', condition: '< 11.8V (OFF)', threshold1: 11.8, unit1: 'V', threshold2: 0, unit2: 's', severity: 'High', pid: '01-42', useCase: 'Battery failure' },
    
    // Temperature Alerts
    { id: 12, type: 'Alert', enabled: true, category: 'Temperature', name: 'Overheat Critical', condition: '> 110°C', threshold1: 110, unit1: '°C', threshold2: 5, unit2: 's', severity: 'Critical', pid: '01-05', useCase: 'Detect overheating' },
    { id: 14, type: 'Alert', enabled: false, category: 'Temperature', name: 'Cold Start Warm-Up', condition: '< 40°C for > 5 min after start', threshold1: 40, unit1: '°C', threshold2: 300, unit2: 's', severity: 'Low', pid: '01-05', useCase: 'Thermostat issue' },
    { id: 29, type: 'Alert', enabled: true, category: 'Temperature', name: 'Coolant Sensor Drift', condition: 'Stable reading > 30 min = sensor stuck', threshold1: 30, unit1: 'min', threshold2: null, unit2: '', severity: 'Medium', pid: '01-05', useCase: 'Sensor stuck detection' },
    { id: 27, type: 'Alert', enabled: true, category: 'Temperature', name: 'IAT Overheat Under Load', condition: '> 70°C + Load > 80%', threshold1: 70, unit1: '°C', threshold2: 60, unit2: 's', severity: 'Critical', pid: '01-0F, 01-04', useCase: 'Turbo/engine analytics' },
    { id: 28, type: 'Alert', enabled: false, category: 'Temperature', name: 'High IAT', condition: 'IAT - Ambient > 40°C', threshold1: 40, unit1: '°C', threshold2: 120, unit2: 's', severity: 'High', pid: '01-0F, 01-46', useCase: 'Intercooler inefficiency' },
    
    // Oil Pressure Alerts
    { id: 15, type: 'Alert', enabled: true, category: 'Oil Pressure', name: 'Low Oil Pressure', condition: '< 20 psi for > 5s', threshold1: 20, unit1: 'psi', threshold2: 5, unit2: 's', severity: 'Critical', pid: 'SPN 100', useCase: 'Predictive maintenance' },
    { id: 16, type: 'Alert', enabled: true, category: 'Oil Pressure', name: 'Low Pressure at Idle', condition: '< 15 psi for > 10s while RPM < 900', threshold1: 15, unit1: 'psi', threshold2: 10, unit2: 's', severity: 'Critical', pid: 'SPN 100', useCase: 'Oil pump health' },
    { id: 17, type: 'Alert', enabled: false, category: 'Oil Pressure', name: 'Pressure Spike', condition: '> 90 psi', threshold1: 90, unit1: 'psi', threshold2: 5, unit2: 's', severity: 'High', pid: 'SPN 100', useCase: 'Blockage detection' },
    { id: 30, type: 'Alert', enabled: true, category: 'Oil Pressure', name: 'Oil Sensor Fault', condition: 'Constant 0 reading > 60 s', threshold1: 60, unit1: 's', threshold2: null, unit2: '', severity: 'High', pid: 'SPN 100', useCase: 'Sensor fault detection' },
    
    // Fuel Level Alerts
    { id: 18, type: 'Alert', enabled: false, category: 'Fuel Level', name: 'Fuel Theft', condition: 'Drop > 10% in < 2 min & Speed = 0', threshold1: 10, unit1: '%', threshold2: 120, unit2: 's', severity: 'High', pid: '01-2F, 01-0D', useCase: 'Theft detection' },
    { id: 20, type: 'Alert', enabled: true, category: 'Fuel Level', name: 'DEF Empty', condition: '< 5%', threshold1: 5, unit1: '%', threshold2: 0, unit2: 's', severity: 'Critical', pid: '01-52', useCase: 'Compliance / derate imminent' },
    { id: 21, type: 'Alert', enabled: true, category: 'Fuel Level', name: 'DEF Low', condition: '< 10%', threshold1: 10, unit1: '%', threshold2: 0, unit2: 's', severity: 'High', pid: '01-52', useCase: 'Low DEF warning' },
    { id: 22, type: 'Alert', enabled: false, category: 'Fuel Level', name: 'DEF Consumption Irregularity', condition: 'No DEF drop over > 10h engine run', threshold1: 0, unit1: '%', threshold2: 36000, unit2: 's', severity: 'Medium', pid: '01-52, 01-1F', useCase: 'Dosing system fault' },
    
    // Barometric Pressure Alerts
    { id: 25, type: 'Alert', enabled: false, category: 'Barometric Pressure', name: 'High-Altitude Operation', condition: '< 80 kPa', threshold1: 80, unit1: 'kPa', threshold2: 60, unit2: 's', severity: 'Medium', pid: '01-33', useCase: 'Altitude compensation' },
    { id: 26, type: 'Alert', enabled: false, category: 'Barometric Pressure', name: 'Sensor Mismatch', condition: 'Baro vs MAP deviation > 15 kPa', threshold1: 15, unit1: 'kPa', threshold2: 30, unit2: 's', severity: 'Low', pid: '01-33, 01-0B', useCase: 'Sensor fault detection' },
    
    // Engine Oil Life Alerts
    { id: 31, type: 'Alert', enabled: true, category: 'Engine Oil Life', name: 'Oil Change Critical', condition: '< 15% remaining', threshold1: 15, unit1: '%', threshold2: 0, unit2: 's', severity: 'Critical', pid: '0xFEEE', useCase: 'Preventative maintenance' },
    { id: 32, type: 'Alert', enabled: true, category: 'Engine Oil Life', name: 'Oil Change Due Soon', condition: '< 30% remaining', threshold1: 30, unit1: '%', threshold2: 0, unit2: 's', severity: 'High', pid: '0xFEEE', useCase: 'Preventative maintenance' },
    { id: 33, type: 'Alert', enabled: true, category: 'Engine Oil Life', name: 'Oil Change Reminder', condition: '< 50% remaining', threshold1: 50, unit1: '%', threshold2: 0, unit2: 's', severity: 'Medium', pid: '0xFEEE', useCase: 'Service planning' },
    
    // Tire Pressure Alerts
    { id: 34, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Critical Low Pressure - Front Left', condition: '< 28 PSI', threshold1: 28, unit1: 'PSI', threshold2: 5, unit2: 's', severity: 'Critical', pid: '0xFEEC-582', useCase: 'Safety - blowout risk' },
    { id: 35, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Critical Low Pressure - Front Right', condition: '< 28 PSI', threshold1: 28, unit1: 'PSI', threshold2: 5, unit2: 's', severity: 'Critical', pid: '0xFEEC-583', useCase: 'Safety - blowout risk' },
    { id: 36, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Critical Low Pressure - Rear Left', condition: '< 28 PSI', threshold1: 28, unit1: 'PSI', threshold2: 5, unit2: 's', severity: 'Critical', pid: '0xFEEC-584', useCase: 'Safety - blowout risk' },
    { id: 37, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Critical Low Pressure - Rear Right', condition: '< 28 PSI', threshold1: 28, unit1: 'PSI', threshold2: 5, unit2: 's', severity: 'Critical', pid: '0xFEEC-585', useCase: 'Safety - blowout risk' },
    { id: 38, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Low Pressure Warning - Front Left', condition: '< 30 PSI', threshold1: 30, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'High', pid: '0xFEEC-582', useCase: 'TPMS warning' },
    { id: 39, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Low Pressure Warning - Front Right', condition: '< 30 PSI', threshold1: 30, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'High', pid: '0xFEEC-583', useCase: 'TPMS warning' },
    { id: 40, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Low Pressure Warning - Rear Left', condition: '< 30 PSI', threshold1: 30, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'High', pid: '0xFEEC-584', useCase: 'TPMS warning' },
    { id: 41, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'Low Pressure Warning - Rear Right', condition: '< 30 PSI', threshold1: 30, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'High', pid: '0xFEEC-585', useCase: 'TPMS warning' },
    { id: 42, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'High Pressure - Front Left', condition: '> 40 PSI', threshold1: 40, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'Medium', pid: '0xFEEC-582', useCase: 'Over-inflation warning' },
    { id: 43, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'High Pressure - Front Right', condition: '> 40 PSI', threshold1: 40, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'Medium', pid: '0xFEEC-583', useCase: 'Over-inflation warning' },
    { id: 44, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'High Pressure - Rear Left', condition: '> 40 PSI', threshold1: 40, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'Medium', pid: '0xFEEC-584', useCase: 'Over-inflation warning' },
    { id: 45, type: 'Alert', enabled: true, category: 'Tire Pressure', name: 'High Pressure - Rear Right', condition: '> 40 PSI', threshold1: 40, unit1: 'PSI', threshold2: 10, unit2: 's', severity: 'Medium', pid: '0xFEEC-585', useCase: 'Over-inflation warning' },
    { id: 46, type: 'Alert', enabled: false, category: 'Tire Pressure', name: 'Pressure Imbalance (L/R)', condition: 'Left vs Right difference > 3 PSI', threshold1: 3, unit1: 'PSI', threshold2: 30, unit2: 's', severity: 'Medium', pid: '0xFEEC', useCase: 'Alignment / uneven wear' },
    { id: 47, type: 'Alert', enabled: false, category: 'Tire Pressure', name: 'Rapid Pressure Drop', condition: 'Drop > 5 PSI in < 5 min', threshold1: 5, unit1: 'PSI', threshold2: 300, unit2: 's', severity: 'Critical', pid: '0xFEEC', useCase: 'Puncture detection' },
    
    // Maintenance Rules
    { id: 101, type: 'Maintenance', enabled: true, category: 'Maintenance', name: 'Oil Change', condition: 'Every 10,000 km or 250 engine hours', threshold1: 10000, unit1: 'km', threshold2: null, unit2: '', severity: 'Medium', pid: '01-31', useCase: 'Lubrication maintenance' },
    { id: 102, type: 'Maintenance', enabled: true, category: 'Maintenance', name: 'Brake Inspection', condition: '> 15,000 km since last inspection', threshold1: 15000, unit1: 'km', threshold2: null, unit2: '', severity: 'High', pid: 'Odometer', useCase: 'Brake system wear' },
    { id: 103, type: 'Maintenance', enabled: true, category: 'Maintenance', name: 'Tire Rotation/Pressure', condition: 'Every 8,000-10,000 km or TPMS fault', threshold1: 9000, unit1: 'km', threshold2: null, unit2: '', severity: 'Medium', pid: 'Odometer', useCase: 'Tire wear and inflation' },
    { id: 104, type: 'Maintenance', enabled: true, category: 'Maintenance', name: 'Air Filter Change', condition: 'MAF drop > 15% from baseline', threshold1: 15, unit1: '%', threshold2: null, unit2: '', severity: 'Medium', pid: '01-10', useCase: 'Airflow restriction' },
    { id: 105, type: 'Maintenance', enabled: true, category: 'Maintenance', name: 'Fuel Filter Change', condition: 'Long-term fuel trim > ±10% for > 1,000s', threshold1: 10, unit1: '%', threshold2: 1000, unit2: 's', severity: 'Medium', pid: '01-07, 01-08', useCase: 'Fuel delivery efficiency' }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-600';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-600';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-600';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-600';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-600';
    }
  };

  const getStatusColor = (status) => {
    return 'bg-red-500';
  };

  // Group rules by category
  const groupedRules = combinedRules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {});

  // Handle toggle category
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Save changes
  const saveChanges = () => {
    setOriginalRules(JSON.parse(JSON.stringify(combinedRules)));
    setHasUnsavedChanges(false);
    alert('Changes saved successfully!');
  };

  // Handle customize button click
  const handleCustomizeClick = () => {
    if (!showCustomize) {
      // Opening customize - save original state
      setOriginalRules(JSON.parse(JSON.stringify(combinedRules)));
      setShowCustomize(true);
    } else {
      // Closing customize - check for unsaved changes
      if (hasUnsavedChanges) {
        const confirmed = window.confirm('You have unsaved changes. Do you want to save before leaving?');
        if (confirmed) {
          saveChanges();
        } else {
          // Revert changes
          if (originalRules) {
            setCombinedRules(originalRules);
          }
          setHasUnsavedChanges(false);
        }
      }
      setShowCustomize(false);
    }
  };

  // Mark as changed when rules are edited
  const updateRule = (ruleId, field, value) => {
    setCombinedRules(combinedRules.map(r => 
      r.id === ruleId ? { ...r, [field]: value } : r
    ));
    setHasUnsavedChanges(true);
  };

  // Download functions
  const downloadAlertFeed = () => {
    const headers = ['Vehicle', 'Alert Type', 'Severity', 'Timestamp'];
    const csvData = filteredAlertFeed.map(a => [a.vehicle, a.type, a.severity, a.timestamp]);
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alert_feed_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadVehiclesByAlerts = () => {
    const headers = ['Vehicle', 'Alert Count', 'Top Severity', 'Alerts'];
    const csvData = filteredVehiclesByAlerts.map(v => [
      v.vehicle,
      v.alertCount,
      v.topSeverity,
      v.allAlerts.map(a => a.name).join('; ')
    ]);
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehicles_by_alerts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadMaintenance = () => {
    const headers = ['Vehicle', 'Task', 'Due Date', 'Status'];
    const csvData = maintenanceItems.map(m => [m.vehicle, m.task, m.dueDate, m.status]);
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maintenance_due_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter alerts by severity and search
  const filteredAlertFeed = alertFeed.filter(alert => {
    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
    const matchesSearch = !searchTerm || 
      alert.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  // Filter vehicles by search
  const filteredVehiclesByAlerts = vehiclesByAlerts.filter(item => {
    const matchesSearch = !searchTerm || 
      item.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || 
      item.allAlerts.some(alert => alert.severity === severityFilter);
    return matchesSearch && matchesSeverity;
  });

  // Pagination for each column
  const paginatedAlertFeed = filteredAlertFeed.slice((alertFeedPage - 1) * itemsPerPage, alertFeedPage * itemsPerPage);
  const paginatedVehicles = filteredVehiclesByAlerts.slice((vehiclesPage - 1) * itemsPerPage, vehiclesPage * itemsPerPage);
  const paginatedMaintenance = maintenanceItems.slice((maintenancePage - 1) * itemsPerPage, maintenancePage * itemsPerPage);

  const alertFeedPages = Math.ceil(filteredAlertFeed.length / itemsPerPage);
  const vehiclesPages = Math.ceil(filteredVehiclesByAlerts.length / itemsPerPage);
  const maintenancePages = Math.ceil(maintenanceItems.length / itemsPerPage);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Search Bar, Filters, and Customize Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by VIN, Camera SN, or Vehicle ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors ${
              showFilters 
                ? 'bg-purple-50 border-[#5b4b9d] text-[#5b4b9d]' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Severity
            {severityFilter !== 'All' && (
              <span className="w-2 h-2 bg-[#5b4b9d] rounded-full"></span>
            )}
          </button>
        </div>
        <button
          onClick={handleCustomizeClick}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors ${
            showCustomize
              ? 'bg-purple-50 border-[#5b4b9d] text-[#5b4b9d]'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          Customize Alerts & Maintenance
          {hasUnsavedChanges && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#5b4b9d]" />
              Filter by Severity
            </h3>
            <button
              onClick={() => setSeverityFilter('All')}
              className="text-xs text-[#5b4b9d] font-semibold hover:text-[#6d5ba7] transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="flex gap-3">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((severity) => (
              <button
                key={severity}
                onClick={() => {
                  setSeverityFilter(severity);
                  setShowFilters(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  severityFilter === severity
                    ? 'bg-purple-50 border-[#5b4b9d] text-[#5b4b9d]'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {severity === 'Critical' && '🔴'}
                {severity === 'High' && '🟠'}
                {severity === 'Medium' && '🟡'}
                {severity === 'Low' && '🔵'}
                {severity}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content - Either 3 Columns OR Rules Table */}
      {!showCustomize ? (
        /* 3 Columns filling remaining height */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Alert Feed (33%) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col min-h-0">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#5b4b9d]" />
                  Alert Feed
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-1">Last 7 days</p>
              </div>
              <div className="flex items-center gap-2">
                {alertFeedPages > 1 && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                    <button
                      onClick={() => setAlertFeedPage(prev => Math.max(1, prev - 1))}
                      disabled={alertFeedPage === 1}
                      className="hover:text-[#5b4b9d] disabled:opacity-30"
                    >
                      &lt;
                    </button>
                    <span>Page {alertFeedPage}/{alertFeedPages}</span>
                    <button
                      onClick={() => setAlertFeedPage(prev => Math.min(alertFeedPages, prev + 1))}
                      disabled={alertFeedPage === alertFeedPages}
                      className="hover:text-[#5b4b9d] disabled:opacity-30"
                    >
                      &gt;
                    </button>
                  </div>
                )}
                <button
                  onClick={downloadAlertFeed}
                  className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Download Alert Feed"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {paginatedAlertFeed.map((alert) => (
              <div key={alert.id} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors h-[68px] flex items-center">
                <div className="flex items-center gap-2 w-full">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor('Active')}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900">{alert.vehicle}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-600 font-medium mt-0.5">
                      <span className="truncate">{alert.type}</span>
                      <span className="text-gray-500 ml-2 whitespace-nowrap">{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles by Most Alerts (33%) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col min-h-0">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Vehicles by Alerts
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-1">Ranked by alert count</p>
              </div>
              <div className="flex items-center gap-2">
                {vehiclesPages > 1 && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                    <button
                      onClick={() => setVehiclesPage(prev => Math.max(1, prev - 1))}
                      disabled={vehiclesPage === 1}
                      className="hover:text-[#5b4b9d] disabled:opacity-30"
                    >
                      &lt;
                    </button>
                    <span>Page {vehiclesPage}/{vehiclesPages}</span>
                    <button
                      onClick={() => setVehiclesPage(prev => Math.min(vehiclesPages, prev + 1))}
                      disabled={vehiclesPage === vehiclesPages}
                      className="hover:text-[#5b4b9d] disabled:opacity-30"
                    >
                      &gt;
                    </button>
                  </div>
                )}
                <button
                  onClick={downloadVehiclesByAlerts}
                  className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Download Vehicles by Alerts"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {paginatedVehicles.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors h-[68px] flex items-start overflow-hidden">
                <div className="flex items-start gap-2 w-full h-full">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex-shrink-0">
                    {item.alertCount}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="font-bold text-xs text-gray-900">{item.vehicle}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 overflow-hidden" style={{ maxHeight: '32px' }}>
                      {item.allAlerts.map((alert, alertIdx) => (
                        <span 
                          key={alertIdx}
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border ${getSeverityColor(alert.severity)}`}
                        >
                          {alert.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Due (33%) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col min-h-0">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Maintenance Due
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-1">Upcoming & overdue</p>
              </div>
              <div className="flex items-center gap-2">
                {maintenancePages > 1 && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                    <button
                      onClick={() => setMaintenancePage(prev => Math.max(1, prev - 1))}
                      disabled={maintenancePage === 1}
                      className="hover:text-[#5b4b9d] disabled:opacity-30"
                    >
                      &lt;
                    </button>
                    <span>Page {maintenancePage}/{maintenancePages}</span>
                    <button
                      onClick={() => setMaintenancePage(prev => Math.min(maintenancePages, prev + 1))}
                      disabled={maintenancePage === maintenancePages}
                      className="hover:text-[#5b4b9d] disabled:opacity-30"
                    >
                      &gt;
                    </button>
                  </div>
                )}
                <button
                  onClick={downloadMaintenance}
                  className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Download Maintenance Schedule"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {paginatedMaintenance.map((item, idx) => (
              <div key={idx} className="group p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors h-[68px] flex items-center">
                <div className="flex items-center gap-2 w-full">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.status === 'Overdue' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900">{item.vehicle}</span>
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                          item.status === 'Overdue'
                            ? 'bg-red-50 text-red-700 border-red-600'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-600'
                        }`}>
                          {item.status}
                        </span>
                        <button
                          onClick={() => {
                            setMaintenanceItems(maintenanceItems.filter((_, i) => i !== idx));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-emerald-50 rounded transition-opacity"
                          title="Mark as completed"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-600 font-medium mt-0.5">
                      <span className="truncate">{item.task}</span>
                      <span className="text-gray-500 ml-2 whitespace-nowrap">{item.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      ) : (
        /* Combined Alert & Maintenance Rules Table - Full Width */
        <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-lg flex-1 overflow-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#5b4b9d]" />
                Alert & Maintenance Rules
              </h3>
              <p className="text-xs text-gray-600 font-medium mt-1">Configure diagnostic thresholds and maintenance triggers</p>
            </div>
            {hasUnsavedChanges && (
              <button
                onClick={saveChanges}
                className="flex items-center gap-2 px-4 py-2 bg-[#5b4b9d] text-white rounded-lg hover:bg-[#6d5ba7] transition-colors font-semibold text-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}
          </div>

          <div className="space-y-2">
            {Object.entries(groupedRules).map(([category, rules]) => (
              <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedCategories[category] ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="font-bold text-gray-900">{category}</span>
                    <span className="text-xs text-gray-500 font-medium">({rules.length} rules)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {rules.filter(r => r.enabled).length} enabled
                    </span>
                  </div>
                </button>

                {/* Expanded Rules */}
                {expandedCategories[category] && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-700 font-bold border-b border-gray-200 bg-white">
                          <th className="px-4 py-3 font-bold">Type</th>
                          <th className="px-4 py-3 font-bold">Rule Name</th>
                          <th className="px-4 py-3 font-bold">Threshold 1</th>
                          <th className="px-4 py-3 font-bold">Threshold 2</th>
                          <th className="px-4 py-3 font-bold">Severity</th>
                          <th className="px-4 py-3 font-bold text-center">Enabled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rules.map((rule) => (
                          <tr key={rule.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                rule.type === 'Alert'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}>
                                {rule.type}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-semibold">{rule.name}</span>
                                <div className="relative inline-block">
                                  <button
                                    onClick={() => setShowConditionHelp(showConditionHelp === rule.id ? null : rule.id)}
                                    className="text-gray-400 hover:text-[#5b4b9d] transition-colors"
                                  >
                                    <HelpCircle className="w-4 h-4" />
                                  </button>
                                  {showConditionHelp === rule.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowConditionHelp(null)}
                                      />
                                      <div className="absolute z-50 left-0 top-6 w-96 bg-white border border-purple-200 rounded-xl p-4 shadow-2xl">
                                        <div className="flex items-start justify-between mb-3">
                                          <h4 className="text-sm font-semibold text-[#5b4b9d]">{rule.name}</h4>
                                          <button 
                                            onClick={() => setShowConditionHelp(null)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                        <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
                                          <p>
                                            <span className="font-semibold">Category:</span> {rule.category}
                                          </p>
                                          <p>
                                            <span className="font-semibold">Use Case:</span> {rule.useCase}
                                          </p>
                                          <p>
                                            <span className="font-semibold">Default Condition:</span> {rule.condition}
                                          </p>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 mt-3">
                                          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">PID Reference:</p>
                                          <p className="text-xs text-[#5b4b9d] font-mono bg-purple-50 px-2 py-1 rounded">{rule.pid}</p>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={rule.threshold1}
                                  onChange={(e) => updateRule(rule.id, 'threshold1', parseFloat(e.target.value))}
                                  className="w-20 px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-900 font-semibold text-center focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d]"
                                />
                                <span className="text-xs text-gray-600 font-semibold">{rule.unit1}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {rule.threshold2 !== null ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={rule.threshold2}
                                    onChange={(e) => updateRule(rule.id, 'threshold2', parseFloat(e.target.value))}
                                    className="w-20 px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-900 font-semibold text-center focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d]"
                                  />
                                  <span className="text-xs text-gray-600 font-semibold">{rule.unit2}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getSeverityColor(rule.severity)}`}>
                                {rule.severity}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={rule.enabled}
                                onChange={() => updateRule(rule.id, 'enabled', !rule.enabled)}
                                className="w-4 h-4 rounded bg-white border-gray-300 text-[#5b4b9d] focus:ring-[#5b4b9d] focus:ring-offset-0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
