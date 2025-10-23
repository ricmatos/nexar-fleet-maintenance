import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Circle, Wrench, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Gauge, Fuel, Clock, Settings, LayoutGrid, HelpCircle, X, Filter } from 'lucide-react';
import { 
  generateFleetMetrics, 
  generateFuelConsumptionData, 
  generateCostPerKMData, 
  generateFuelIdleVsMovingData,
  generateFuelEfficiencyTrendData,
  generateDailyFuelCostData,
  generateAlertsOverTimeData
} from '../data/dummyData';

const Dashboard = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showHelp, setShowHelp] = useState(null); // Track which tooltip is open
  const [selectedKPIs, setSelectedKPIs] = useState({
    totalVehicles: true,
    idleActive: true,
    faults: true,
    maintenance: true,
    fleetHealth: true,
    fuelCost: true
  });
  const [selectedPlots, setSelectedPlots] = useState({
    fuelEfficiencyTrend: true,
    fuelConsumption: true,
    fuelIdleVsMoving: true,
    costPerKm: true,
    alertsOverTime: true,
    fleetUtilization: true
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    vehicleType: 'All',
    fuelType: 'All',
    dateRange: 'Last 30 days'
  });

  // Apply filters to data
  const getFilteredMetrics = () => {
    const baseMetrics = generateFleetMetrics();
    
    // Adjust metrics based on vehicle type filter
    if (filters.vehicleType !== 'All') {
      // Simulate filtering by reducing vehicle count
      baseMetrics.totalVehicles = filters.vehicleType === 'Van' ? 1 : filters.vehicleType === 'Truck' ? 1 : 1;
      baseMetrics.vehiclesActive = 1;
      baseMetrics.vehiclesIdle = filters.vehicleType === 'Truck' ? 1 : 0;
      baseMetrics.idlePercentage = filters.vehicleType === 'Truck' ? 100 : 0;
      baseMetrics.fuelCostPerKm = filters.vehicleType === 'Van' ? 0.24 : filters.vehicleType === 'Truck' ? 0.18 : 0.26;
    }
    
    // Adjust metrics based on fuel type filter
    if (filters.fuelType !== 'All') {
      if (filters.fuelType === 'Electric') {
        baseMetrics.fuelCostPerKm = 0.08;
        baseMetrics.avgFuelEfficiency = 0; // N/A for electric
        baseMetrics.fuelConsumptionIdle = 0;
        baseMetrics.idleFuelPercentage = 0;
      } else if (filters.fuelType === 'Hybrid') {
        baseMetrics.fuelCostPerKm = 0.15;
        baseMetrics.avgFuelEfficiency = 12.5;
        baseMetrics.idleFuelPercentage = 15.2;
      } else if (filters.fuelType === 'Diesel') {
        baseMetrics.avgFuelEfficiency = 9.2;
        baseMetrics.fuelCostPerKm = 0.19;
      }
    }
    
    return baseMetrics;
  };

  const getFilteredFuelData = () => {
    let data = [];
    
    // Generate data based on date range
    if (filters.dateRange === 'Last 7 days') {
      data = [
        { date: 'Oct 15', value: 2.8 },
        { date: 'Oct 16', value: 3.1 },
        { date: 'Oct 17', value: 2.6 },
        { date: 'Oct 18', value: 2.9 },
        { date: 'Oct 19', value: 2.4 },
        { date: 'Oct 20', value: 2.7 },
        { date: 'Oct 21', value: 2.5 }
      ];
    } else if (filters.dateRange === 'Last 90 days') {
      // Generate more data points for 90 days
      data = [
        { date: 'Jul 23', value: 2.2 },
        { date: 'Aug 6', value: 2.6 },
        { date: 'Aug 20', value: 2.9 },
        { date: 'Sep 3', value: 2.4 },
        { date: 'Sep 17', value: 2.8 },
        { date: 'Oct 1', value: 2.5 },
        { date: 'Oct 15', value: 2.6 },
        { date: 'Oct 21', value: 2.7 }
      ];
    } else if (filters.dateRange === 'Next 30 days') {
      // Forecast data
      data = [
        { date: 'Oct 22', value: 2.6 },
        { date: 'Oct 28', value: 2.8 },
        { date: 'Nov 4', value: 2.5 },
        { date: 'Nov 11', value: 2.7 },
        { date: 'Nov 18', value: 2.9 }
      ];
    } else {
      // Last 30 days (default)
      data = [
        { date: 'Sep 21', value: 2.3 },
        { date: 'Sep 28', value: 2.7 },
        { date: 'Oct 5', value: 2.9 },
        { date: 'Oct 12', value: 2.4 },
        { date: 'Oct 19', value: 2.6 }
      ];
    }
    
    // Apply fuel type multiplier
    if (filters.fuelType === 'Electric') {
      return data.map(d => ({ ...d, value: 0 })); // No fuel for electric
    } else if (filters.fuelType === 'Hybrid') {
      return data.map(d => ({ ...d, value: d.value * 0.6 })); // 40% less fuel
    } else if (filters.fuelType === 'Diesel') {
      return data.map(d => ({ ...d, value: d.value * 1.1 })); // 10% more efficient
    }
    
    return data;
  };

  const getFilteredCostData = () => {
    const baseData = generateCostPerKMData();
    
    // Filter by vehicle type
    if (filters.vehicleType !== 'All') {
      return baseData.filter(d => d.type === filters.vehicleType);
    }
    
    // Adjust based on fuel type
    if (filters.fuelType === 'Electric') {
      return baseData.map(d => ({ ...d, cost: d.cost * 0.35 })); // Much cheaper
    } else if (filters.fuelType === 'Hybrid') {
      return baseData.map(d => ({ ...d, cost: d.cost * 0.7 })); // 30% cheaper
    } else if (filters.fuelType === 'Diesel') {
      return baseData.map(d => ({ ...d, cost: d.cost * 0.85 })); // Slightly cheaper
    }
    
    return baseData;
  };

  const getFilteredIdleVsMovingData = () => {
    const baseData = generateFuelIdleVsMovingData();
    
    if (filters.fuelType === 'Electric') {
      return [
        { category: 'Moving', fuel: 0, percentage: 0 },
        { category: 'Idle', fuel: 0, percentage: 0 }
      ];
    } else if (filters.fuelType === 'Hybrid') {
      return [
        { category: 'Moving', fuel: 22.5, percentage: 85 },
        { category: 'Idle', fuel: 4.0, percentage: 15 }
      ];
    }
    
    return baseData;
  };

  const getFilteredEfficiencyTrend = () => {
    let data = [];
    
    // Generate data based on date range
    if (filters.dateRange === 'Last 7 days') {
      data = [
        { date: 'Oct 15', efficiency: 8.3, baseline: 9.0 },
        { date: 'Oct 16', efficiency: 8.5, baseline: 9.0 },
        { date: 'Oct 17', efficiency: 8.2, baseline: 9.0 },
        { date: 'Oct 18', efficiency: 8.6, baseline: 9.0 },
        { date: 'Oct 19', efficiency: 8.4, baseline: 9.0 },
        { date: 'Oct 20', efficiency: 8.7, baseline: 9.0 },
        { date: 'Oct 21', efficiency: 8.5, baseline: 9.0 }
      ];
    } else if (filters.dateRange === 'Last 90 days') {
      data = [
        { date: 'Jul 23', efficiency: 8.0, baseline: 9.0 },
        { date: 'Aug 6', efficiency: 8.3, baseline: 9.0 },
        { date: 'Aug 20', efficiency: 8.6, baseline: 9.0 },
        { date: 'Sep 3', efficiency: 8.2, baseline: 9.0 },
        { date: 'Sep 17', efficiency: 8.5, baseline: 9.0 },
        { date: 'Oct 1', efficiency: 8.4, baseline: 9.0 },
        { date: 'Oct 15', efficiency: 8.6, baseline: 9.0 },
        { date: 'Oct 21', efficiency: 8.5, baseline: 9.0 }
      ];
    } else if (filters.dateRange === 'Next 30 days') {
      data = [
        { date: 'Oct 22', efficiency: 8.5, baseline: 9.0 },
        { date: 'Oct 28', efficiency: 8.7, baseline: 9.0 },
        { date: 'Nov 4', efficiency: 8.6, baseline: 9.0 },
        { date: 'Nov 11', efficiency: 8.8, baseline: 9.0 },
        { date: 'Nov 18', efficiency: 8.9, baseline: 9.0 }
      ];
    } else {
      // Last 30 days (default)
      data = [
        { date: 'Sep 21', efficiency: 8.2, baseline: 9.0 },
        { date: 'Sep 28', efficiency: 8.7, baseline: 9.0 },
        { date: 'Oct 5', efficiency: 8.5, baseline: 9.0 },
        { date: 'Oct 12', efficiency: 8.3, baseline: 9.0 },
        { date: 'Oct 19', efficiency: 8.6, baseline: 9.0 }
      ];
    }
    
    // Apply fuel type multiplier
    if (filters.fuelType === 'Diesel') {
      return data.map(d => ({ ...d, efficiency: d.efficiency * 1.08, baseline: d.baseline * 1.08 }));
    } else if (filters.fuelType === 'Hybrid') {
      return data.map(d => ({ ...d, efficiency: d.efficiency * 1.45, baseline: d.baseline * 1.45 }));
    }
    
    return data;
  };

  const getFilteredAlertsOverTime = () => {
    let data = generateAlertsOverTimeData();
    
    // Adjust based on date range
    if (filters.dateRange === 'Last 7 days') {
      data = [
        { date: 'Oct 15', critical: 0, high: 1, medium: 1, low: 0 },
        { date: 'Oct 16', critical: 1, high: 0, medium: 0, low: 1 },
        { date: 'Oct 17', critical: 0, high: 2, medium: 1, low: 0 },
        { date: 'Oct 18', critical: 0, high: 1, medium: 2, low: 0 },
        { date: 'Oct 19', critical: 1, high: 1, medium: 0, low: 1 },
        { date: 'Oct 20', critical: 2, high: 0, medium: 1, low: 0 },
        { date: 'Oct 21', critical: 1, high: 2, medium: 1, low: 1 }
      ];
    } else if (filters.dateRange === 'Last 90 days') {
      data = [
        { date: 'Jul', critical: 1, high: 2, medium: 3, low: 2 },
        { date: 'Aug', critical: 2, high: 3, medium: 2, low: 1 },
        { date: 'Sep', critical: 1, high: 2, medium: 4, low: 3 },
        { date: 'Oct', critical: 3, high: 3, medium: 2, low: 2 }
      ];
    }
    
    return data;
  };

  const getFilteredDailyCost = () => {
    let data = [];
    
    // Generate data based on date range
    if (filters.dateRange === 'Last 7 days') {
      data = [
        { date: 'Oct 15', cost: 65.2 },
        { date: 'Oct 16', cost: 71.8 },
        { date: 'Oct 17', cost: 59.3 },
        { date: 'Oct 18', cost: 68.5 },
        { date: 'Oct 19', cost: 62.7 },
        { date: 'Oct 20', cost: 70.1 },
        { date: 'Oct 21', cost: 64.9 }
      ];
    } else if (filters.dateRange === 'Last 90 days') {
      data = [
        { date: 'Jul', cost: 58.5 },
        { date: 'Aug', cost: 64.2 },
        { date: 'Sep', cost: 67.8 },
        { date: 'Oct', cost: 69.3 }
      ];
    } else if (filters.dateRange === 'Next 30 days') {
      data = [
        { date: 'Week 1', cost: 68.0 },
        { date: 'Week 2', cost: 72.0 },
        { date: 'Week 3', cost: 65.0 },
        { date: 'Week 4', cost: 70.0 }
      ];
    } else {
      // Last 30 days - weekly breakdown
      data = [
        { date: 'Week 1', cost: 62.5 },
        { date: 'Week 2', cost: 71.2 },
        { date: 'Week 3', cost: 68.9 },
        { date: 'Week 4', cost: 67.8 }
      ];
    }
    
    // Apply fuel type multiplier
    if (filters.fuelType === 'Electric') {
      return data.map(d => ({ ...d, cost: d.cost * 0.3 }));
    } else if (filters.fuelType === 'Hybrid') {
      return data.map(d => ({ ...d, cost: d.cost * 0.65 }));
    } else if (filters.fuelType === 'Diesel') {
      return data.map(d => ({ ...d, cost: d.cost * 0.9 }));
    }
    
    return data;
  };

  const metrics = getFilteredMetrics();
  const fuelData = getFilteredFuelData();
  const costData = getFilteredCostData();
  const idleVsMovingData = getFilteredIdleVsMovingData();
  const efficiencyTrendData = getFilteredEfficiencyTrend();
  const dailyCostData = getFilteredDailyCost();
  const alertsOverTimeData = getFilteredAlertsOverTime();

  const COLORS = ['#06b6d4', '#f59e0b'];

  // Info Tooltip Component
  const InfoTooltip = ({ id, title, description, calculation }) => (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowHelp(showHelp === id ? null : id);
        }}
        className="text-gray-400 hover:text-[#5b4b9d] transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {showHelp === id && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowHelp(null)}
          />
          <div className="absolute z-50 left-0 top-6 w-80 bg-white border border-purple-200 rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-semibold text-[#5b4b9d]">{title}</h4>
              <button 
                onClick={() => setShowHelp(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">{description}</p>
            {calculation && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Calculation:</p>
                <p className="text-xs text-[#5b4b9d] font-mono bg-purple-50 px-2 py-1 rounded">{calculation}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue, alert, helpId, helpTitle, helpDescription, helpCalculation }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[11px] text-gray-700 uppercase tracking-wider font-semibold">{title}</h3>
            {helpId && <InfoTooltip id={helpId} title={helpTitle} description={helpDescription} calculation={helpCalculation} />}
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trendValue && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trendValue}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            {subtitle && <p className="text-xs text-gray-600 font-medium">{subtitle}</p>}
            {alert && (
              <div className={`text-[10px] px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-semibold border ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-600'
                  : alert.type === 'critical'
                  ? 'bg-red-50 text-red-700 border-red-600'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-600'
              }`}>
                <AlertTriangle className="w-3 h-3" />
                {alert.message}
              </div>
            )}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-gray-800">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 p-3 rounded-lg shadow-xl">
          <p className="text-gray-600 text-xs mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-gray-900 text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const availableKPIs = [
    { key: 'totalVehicles', label: 'Total Vehicles', component: (
      <MetricCard
        title="Total Vehicles"
        value={metrics.totalVehicles}
        subtitle="Registered assets"
        icon={Activity}
        color="bg-cyan-900/30 text-cyan-400"
        helpId="kpi-total-vehicles"
        helpTitle="Total Vehicles"
        helpDescription="The total count of all registered fleet assets in your organization. This serves as the baseline for calculating utilization and efficiency KPIs."
        helpCalculation="Count of all vehicles in fleet registry"
      />
    )},
    { key: 'idleActive', label: 'Idle / Active', component: (
      <MetricCard
        title="Idle / Active"
        value={`${metrics.vehiclesIdle} / ${metrics.vehiclesActive}`}
        subtitle={`${metrics.idlePercentage.toFixed(1)}% idle`}
        icon={Circle}
        color="bg-emerald-900/30 text-emerald-400"
        alert={metrics.idlePercentage > 25 ? {
          type: 'warning',
          message: 'Under-utilization'
        } : null}
        helpId="kpi-idle-active"
        helpTitle="Vehicles Idle / Active"
        helpDescription="Measures real-time fleet utilization by comparing vehicles with engine ON but Speed = 0 (Idle) versus vehicles actively moving. High idle percentage indicates under-utilization of fleet assets."
        helpCalculation="Idle % = (Engines ON & Speed = 0) / Total Vehicles × 100"
      />
    )},
    { key: 'faults', label: 'Faults', component: (
      <MetricCard
        title="Active Faults"
        value={metrics.faultsOverTime.current}
        subtitle="DTCs detected"
        icon={AlertTriangle}
        color="bg-red-900/30 text-red-400"
        trend="up"
        trendValue={`+${metrics.faultsOverTime.percentChange}%`}
        alert={metrics.faultsOverTime.percentChange > 20 ? {
          type: 'warning',
          message: 'Investigate faults'
        } : null}
        helpId="kpi-faults"
        helpTitle="Active Faults"
        helpDescription="Tracks Diagnostic Trouble Codes (DTCs) from OBD-II system over rolling 7-day/30-day period. Monitors reliability trends and emerging issues. Rising fault count indicates potential system problems requiring investigation."
        helpCalculation="Current DTC count with trend % vs previous period"
      />
    )},
    { key: 'maintenance', label: 'Maintenance Due', component: (
      <MetricCard
        title="Maintenance"
        value={`${metrics.maintenanceDue}`}
        subtitle={`${metrics.maintenanceOverdue} overdue`}
        icon={Wrench}
        color="bg-yellow-900/30 text-yellow-400"
        alert={metrics.maintenancePercentage > 10 ? {
          type: 'warning',
          message: 'Schedule service'
        } : null}
        helpId="kpi-maintenance"
        helpTitle="Maintenance Due / Overdue"
        helpDescription="Tracks preventive maintenance compliance by counting vehicles where service distance/time exceeds threshold. Helps ensure fleet reliability and compliance with manufacturer service schedules."
        helpCalculation="Count vehicles where (km > threshold) OR (days overdue > X)"
      />
    )},
    { key: 'fleetHealth', label: 'Fleet Health', component: (
      <MetricCard
        title="Fleet Health"
        value={metrics.fleetHealthIndex}
        subtitle="Score (0-100)"
        icon={Gauge}
        color="bg-purple-900/30 text-purple-400"
        alert={metrics.fleetHealthIndex < 70 ? {
          type: 'critical',
          message: 'Inefficient fleet'
        } : {
          type: 'success',
          message: 'Good performance'
        }}
        helpId="kpi-fleet-health"
        helpTitle="Fleet Health Index"
        helpDescription="A composite score (0-100) that combines fuel efficiency, idle time, cost per km, and reliability metrics to provide a single indicator of overall fleet performance. Score < 70 indicates inefficient operation."
        helpCalculation="FuelEff × 35% + Idle × 25% + Cost/km × 25% + Reliability × 15%"
      />
    )},
    { key: 'fuelCost', label: 'Fuel Cost/KM', component: (
      <MetricCard
        title="Fuel Cost/KM"
        value={`$${metrics.fuelCostPerKm.toFixed(2)}`}
        subtitle={`Target: $${metrics.baselineCostPerKm.toFixed(2)}`}
        icon={DollarSign}
        color="bg-green-900/30 text-green-400"
        trend="up"
        trendValue={`+${((metrics.fuelCostPerKm - metrics.baselineCostPerKm) / metrics.baselineCostPerKm * 100).toFixed(1)}%`}
        alert={metrics.fuelCostPerKm > metrics.baselineCostPerKm ? {
          type: 'warning',
          message: 'Above target'
        } : null}
        helpId="kpi-fuel-cost"
        helpTitle="Fuel Cost per KM"
        helpDescription="Enables cost analytics and profitability tracking by calculating total fuel expenditure per kilometer driven. Integrates fuel consumption data with dynamic pricing. Compare across routes, drivers, and vehicle classes."
        helpCalculation="(Fuel Used × Fuel Price) / Distance Traveled"
      />
    )},
    { key: 'fuelEfficiency', label: 'Fuel Efficiency', component: (
      <MetricCard
        title="Fuel Efficiency"
        value={filters.fuelType === 'Electric' ? 'N/A' : `${metrics.avgFuelEfficiency} km/L`}
        subtitle={filters.fuelType === 'Electric' ? 'Electric vehicle' : `${metrics.avgFuelEfficiencyL100km} L/100km`}
        icon={Fuel}
        color="bg-blue-900/30 text-blue-400"
        alert={filters.fuelType === 'Electric' ? null : metrics.avgFuelEfficiency < (metrics.baselineFuelEfficiency * 0.85) ? {
          type: 'warning',
          message: 'Low efficiency'
        } : null}
        helpId="kpi-fuel-efficiency"
        helpTitle="Average Fuel Efficiency"
        helpDescription="Measures average fuel economy across the fleet using OBD-II fuel rate (PID 01-5E) and distance data. Normalized by vehicle class, load, and route type for fair comparisons. Alert triggers when < 15% below baseline."
        helpCalculation="Distance Traveled / Fuel Used (km/L) or inverse (L/100km)"
      />
    )},
    { key: 'idleFuel', label: 'Idle Fuel Loss', component: (
      <MetricCard
        title="Idle Fuel Loss"
        value={filters.fuelType === 'Electric' ? 'N/A' : `${metrics.idleFuelPercentage.toFixed(1)}%`}
        subtitle={filters.fuelType === 'Electric' ? 'No idle loss' : `${metrics.fuelConsumptionIdle.toFixed(1)}L idle`}
        icon={Clock}
        color="bg-orange-900/30 text-orange-400"
        alert={filters.fuelType === 'Electric' ? null : metrics.idleFuelPercentage > 25 ? {
          type: 'warning',
          message: 'Excessive idle'
        } : {
          type: 'success',
          message: 'Optimal idle'
        }}
        helpId="kpi-idle-fuel"
        helpTitle="Idle Fuel Loss"
        helpDescription="Assesses efficiency balance between active driving and idle operation. Separates fuel consumption when Speed = 0 vs Speed > 0 using OBD-II data. High idle fuel % indicates driver behavior issues or excessive waiting time."
        helpCalculation="(Idle Fuel / Total Fuel) × 100 where Idle = Speed = 0"
      />
    )}
  ];

  const availablePlots = [
    { 
      key: 'fuelEfficiencyTrend', 
      label: 'Fuel Efficiency Trend', 
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Fuel Efficiency Trend</h3>
                <InfoTooltip 
                  id="plot-fuel-efficiency-trend"
                  title="Fuel Efficiency Trend"
                  description="Tracks actual fuel economy vs baseline target over time. Shows if fleet is improving or degrading in fuel performance. Useful for identifying seasonal patterns, driver training effectiveness, or mechanical issues."
                  calculation="Actual: Distance / Fuel | Target: OEM baseline"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">km/L vs Baseline</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={efficiencyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#374151" 
                    style={{ fontSize: '11px', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#374151" 
                    style={{ fontSize: '11px', fontWeight: '600' }}
                domain={[7, 10]}
              />
              <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#374151' }} />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Actual"
                dot={{ fill: '#3b82f6', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      key: 'fuelConsumption',
      label: 'Fuel Consumption',
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Fuel Consumption</h3>
                <InfoTooltip 
                  id="plot-fuel-consumption"
                  title="Fuel Consumption Trend"
                  description="Shows total daily fuel usage across entire fleet. Useful for identifying abnormal consumption patterns, refueling events, and weekly usage trends. Derived from OBD-II fuel rate (PID 01-5E) integrated over time."
                  calculation="Σ(Fuel Rate × Time) per period"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">L/day trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={fuelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#374151" 
                    style={{ fontSize: '11px', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#374151" 
                    style={{ fontSize: '11px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 3 }}
                name="Liters"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      key: 'fuelIdleVsMoving',
      label: 'Fuel: Moving vs Idle',
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Fuel: Moving vs Idle</h3>
                <InfoTooltip 
                  id="plot-fuel-idle-vs-moving"
                  title="Fuel: Moving vs Idle"
                  description="Pie chart showing fuel consumption breakdown between active driving (Speed > 0) and idling (Speed = 0). Helps identify excessive idle time and opportunities for driver behavior improvement. Target: Keep idle fuel below 20%."
                  calculation="Moving: Σ fuel when Speed > 0 | Idle: Σ fuel when Speed = 0"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">Daily breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={idleVsMovingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="fuel"
              >
                {idleVsMovingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      key: 'costPerKm',
      label: 'Cost per KM',
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Cost per KM</h3>
                <InfoTooltip 
                  id="plot-cost-per-km"
                  title="Cost per KM by Vehicle Type"
                  description="Compares fuel cost efficiency across different vehicle classes (Van, Truck, Car). Helps optimize fleet composition and identify which vehicle types are most cost-effective for specific routes or use cases."
                  calculation="(Total Fuel Cost / Distance) per vehicle type"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">By vehicle type</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={costData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                type="number" 
                stroke="#64748b"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                type="category"
                dataKey="type" 
                stroke="#64748b"
                style={{ fontSize: '11px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill="#3b82f6" radius={[0, 4, 4, 0]} name="USD/km" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      key: 'alertsOverTime',
      label: 'Alerts Over Time',
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Alerts Over Time</h3>
                <InfoTooltip 
                  id="plot-alerts-over-time-2"
                  title="Alerts Over Time by Criticality"
                  description="Displays the number of alerts over time grouped by severity level (Critical, High, Medium, Low). Helps track fault trends and identify periods of increased vehicle issues."
                  calculation="Count of alerts per day/week grouped by severity"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">By severity level</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={alertsOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#374151"
                style={{ fontSize: '11px', fontWeight: '600' }}
              />
              <YAxis 
                stroke="#374151"
                style={{ fontSize: '11px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#374151' }} />
              <Bar dataKey="critical" stackId="a" fill="#dc2626" name="Critical" />
              <Bar dataKey="high" stackId="a" fill="#f59e0b" name="High" />
              <Bar dataKey="medium" stackId="a" fill="#eab308" name="Medium" />
              <Bar dataKey="low" stackId="a" fill="#3b82f6" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      key: 'fleetUtilization',
      label: 'Fleet Utilization',
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Fleet Utilization</h3>
                <InfoTooltip 
                  id="plot-fleet-utilization"
                  title="Fleet Utilization Trend"
                  description="Stacked bar chart showing daily breakdown of vehicles in active use vs idle/parked. Helps identify under-utilized assets, weekend vs weekday patterns, and opportunities for fleet size optimization."
                  calculation="Active: RPM > 0 & Speed > 0 | Idle: RPM > 0 & Speed = 0"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">Active vs Idle trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { day: 'Mon', active: 2, idle: 1 },
              { day: 'Tue', active: 3, idle: 0 },
              { day: 'Wed', active: 2, idle: 1 },
              { day: 'Thu', active: 3, idle: 0 },
              { day: 'Fri', active: 2, idle: 1 },
              { day: 'Sat', active: 1, idle: 2 },
              { day: 'Sun', active: 1, idle: 2 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                style={{ fontSize: '11px' }}
              />
                  <YAxis 
                    stroke="#9ca3af"
                style={{ fontSize: '11px' }}
              />
              <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#374151' }} />
              <Bar dataKey="active" stackId="a" fill="#10b981" name="Active" />
              <Bar dataKey="idle" stackId="a" fill="#f59e0b" name="Idle" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Settings Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Fleet Overview</h2>
          <InfoTooltip 
            id="dashboard-help"
            title="Dashboard Overview"
            description="This dashboard displays real-time OBD-II data from your fleet. Customize KPIs and plots using the Settings button. Click (?) icons on any metric or chart to learn more about calculations and thresholds. Alert badges appear when metrics exceed warning thresholds."
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors ${
              showFilters 
                ? 'bg-purple-50 border-[#5b4b9d] text-[#5b4b9d]' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filters.vehicleType !== 'All' || filters.fuelType !== 'All' || filters.dateRange !== 'Last 30 days') && (
              <span className="w-2 h-2 bg-[#5b4b9d] rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors ${
              showSettings
                ? 'bg-purple-50 border-[#5b4b9d] text-[#5b4b9d]'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Customize Dashboard
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#5b4b9d]" />
              Filter Dashboard Data
            </h3>
            <button
              onClick={() => {
                setFilters({
                  vehicleType: 'All',
                  fuelType: 'All',
                  dateRange: 'Last 30 days'
                });
              }}
              className="text-xs text-[#5b4b9d] font-semibold hover:text-[#6d5ba7] transition-colors"
            >
              Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Type Filter */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2">Vehicle Type</label>
              <select
                value={filters.vehicleType}
                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
              >
                <option value="All">All Types</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2">Fuel Type</label>
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
              >
                <option value="All">All Fuel Types</option>
                <option value="Gas">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
              >
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 90 days">Last 90 days</option>
                <option value="Next 30 days">Next 30 days (Forecast)</option>
                <option value="Custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600 font-medium">Active filters:</span>
            {filters.vehicleType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Type: {filters.vehicleType}
                <button 
                  onClick={() => setFilters({ ...filters, vehicleType: 'All' })}
                  className="hover:text-cyan-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.fuelType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Fuel: {filters.fuelType}
                <button 
                  onClick={() => setFilters({ ...filters, fuelType: 'All' })}
                  className="hover:text-cyan-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dateRange !== 'Last 30 days' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Period: {filters.dateRange}
                <button 
                  onClick={() => setFilters({ ...filters, dateRange: 'Last 30 days' })}
                  className="hover:text-cyan-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.vehicleType === 'All' && filters.fuelType === 'All' && filters.dateRange === 'Last 30 days' && (
              <span className="text-xs text-slate-500 italic">No filters applied (showing all data)</span>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border border-purple-200 rounded-xl p-6 space-y-6 shadow-lg">
          {/* KPI Selection */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[#5b4b9d]" />
              Select KPIs to Display (Choose up to 6)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableKPIs.map((kpi) => (
                <label
                  key={kpi.key}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedKPIs[kpi.key]}
                    onChange={(e) => {
                      const selectedCount = Object.values(selectedKPIs).filter(v => v).length;
                      if (e.target.checked && selectedCount >= 6) {
                        return; // Don't allow more than 6
                      }
                      setSelectedKPIs({ ...selectedKPIs, [kpi.key]: e.target.checked });
                    }}
                    className="w-4 h-4 rounded bg-white border-gray-300 text-[#5b4b9d] focus:ring-[#5b4b9d] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900">
                    {kpi.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-600 font-medium mt-3">
              {Object.values(selectedKPIs).filter(v => v).length} / 6 KPIs selected
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Plot Selection */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#5b4b9d]" />
              Select Plots to Display (Choose up to 6)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availablePlots.map((plot) => (
                <label
                  key={plot.key}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlots[plot.key]}
                    onChange={(e) => {
                      const selectedCount = Object.values(selectedPlots).filter(v => v).length;
                      if (e.target.checked && selectedCount >= 6) {
                        return; // Don't allow more than 6
                      }
                      setSelectedPlots({ ...selectedPlots, [plot.key]: e.target.checked });
                    }}
                    className="w-4 h-4 rounded bg-white border-gray-300 text-[#5b4b9d] focus:ring-[#5b4b9d] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900">
                    {plot.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-600 font-medium mt-3">
              {Object.values(selectedPlots).filter(v => v).length} / 6 plots selected
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2.5 bg-[#5b4b9d] hover:bg-[#6d5ba7] text-white text-sm rounded-lg font-semibold transition-colors shadow-sm"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

      {/* Filter Applied Banner */}
      {(filters.vehicleType !== 'All' || filters.fuelType !== 'All' || filters.dateRange !== 'Last 30 days') && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5">
          <p className="text-xs text-[#5b4b9d] font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>
              Displaying filtered data: 
              {filters.vehicleType !== 'All' && ` ${filters.vehicleType} vehicles`}
              {filters.fuelType !== 'All' && ` • ${filters.fuelType} fuel type`}
              {filters.dateRange !== 'Last 30 days' && ` • ${filters.dateRange}`}
            </span>
          </p>
        </div>
      )}

      {/* KPI Cards - Single Row of 6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {availableKPIs
          .filter(kpi => selectedKPIs[kpi.key])
          .slice(0, 6)
          .map(kpi => (
            <div key={kpi.key}>{kpi.component}</div>
          ))}
      </div>

      {/* Charts Grid - Row 1: First 3 plots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {availablePlots
          .filter(plot => selectedPlots[plot.key])
          .slice(0, 3)
          .map(plot => (
            <div key={plot.key}>{plot.component}</div>
          ))}
      </div>

      {/* Charts Grid - Row 2: Next 3 plots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {availablePlots
          .filter(plot => selectedPlots[plot.key])
          .slice(3, 6)
          .map(plot => (
            <div key={plot.key}>{plot.component}</div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
