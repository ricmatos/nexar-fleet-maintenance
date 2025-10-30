import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Circle, Wrench, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Gauge, Fuel, Clock, HelpCircle, X, Filter } from 'lucide-react';
import { 
  generateFleetMetrics, 
  generateFuelConsumptionData, 
  generateCostPerMileData, 
  generateFuelIdleVsMovingData,
  generateFuelEfficiencyTrendData,
  generateDailyFuelCostData,
  generateAlertsOverTimeData
} from '../data/dummyData';

const Dashboard = ({ isChatOpen = false }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showHelp, setShowHelp] = useState(null); // Track which tooltip is open
  
  // Show only 4 KPIs when chat is open, 6 when closed
  const selectedKPIs = isChatOpen ? {
    totalVehicles: false,
    faults: false,
    maintenance: true,
    fleetHealth: true,
    fuelCost: true,
    fuelEfficiency: true
  } : {
    totalVehicles: true,
    faults: true,
    maintenance: true,
    fleetHealth: true,
    fuelCost: true,
    fuelEfficiency: true
  };
  const [selectedPlots] = useState({
    fuelEfficiencyTrend: true,
    fuelConsumption: true,
    idleAnalysis: true,
    costPerMile: true,
    alertsOverTime: true,
    fleetUtilization: true
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    vehicleType: 'All',
    fuelType: 'All',
    dateRange: 'This Month'
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
      baseMetrics.fuelCostPerMile = filters.vehicleType === 'Van' ? 0.39 : filters.vehicleType === 'Truck' ? 0.29 : 0.42;
    }
    
    // Adjust metrics based on fuel type filter
    if (filters.fuelType !== 'All') {
      if (filters.fuelType === 'Electric') {
        baseMetrics.fuelCostPerMile = 0.13;
        baseMetrics.avgFuelEfficiency = 0; // N/A for electric
        baseMetrics.fuelConsumptionIdle = 0;
        baseMetrics.idleFuelPercentage = 0;
      } else if (filters.fuelType === 'Hybrid') {
        baseMetrics.fuelCostPerMile = 0.24;
        baseMetrics.avgFuelEfficiency = 29.4;
        baseMetrics.idleFuelPercentage = 15.2;
      } else if (filters.fuelType === 'Diesel') {
        baseMetrics.avgFuelEfficiency = 21.6;
        baseMetrics.fuelCostPerMile = 0.31;
      }
    }
    
    return baseMetrics;
  };

  const getFilteredFuelData = () => {
    let data = [];
    
    // Generate data based on date range
    if (filters.dateRange === 'This Week' || filters.dateRange === 'Last Week') {
      data = [
        { date: 'Mon', value: 2.8 },
        { date: 'Tue', value: 3.1 },
        { date: 'Wed', value: 2.6 },
        { date: 'Thu', value: 2.9 },
        { date: 'Fri', value: 2.4 },
        { date: 'Sat', value: 2.7 },
        { date: 'Sun', value: 2.5 }
      ];
    } else if (filters.dateRange === 'Last 3 Months') {
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
    } else if (filters.dateRange === 'This Year') {
      data = [
        { date: 'Jan', value: 2.2 },
        { date: 'Feb', value: 2.4 },
        { date: 'Mar', value: 2.6 },
        { date: 'Apr', value: 2.5 },
        { date: 'May', value: 2.7 },
        { date: 'Jun', value: 2.8 },
        { date: 'Jul', value: 2.6 },
        { date: 'Aug', value: 2.9 },
        { date: 'Sep', value: 2.7 },
        { date: 'Oct', value: 2.8 }
      ];
    } else {
      // This Month / Last Month (default)
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
    const baseData = generateCostPerMileData();
    
    // Convert cost to fuel consumption (L/100 miles) - assuming $3.50 per liter
    const fuelData = baseData.map(d => ({ 
      ...d, 
      consumption: (d.cost / 3.5) * 100  // Convert $ to liters per 100 miles
    }));
    
    // Filter by vehicle type
    if (filters.vehicleType !== 'All') {
      return fuelData.filter(d => d.type === filters.vehicleType);
    }
    
    // Adjust based on fuel type
    if (filters.fuelType === 'Electric') {
      return fuelData.map(d => ({ ...d, consumption: 0 })); // No fuel consumption
    } else if (filters.fuelType === 'Hybrid') {
      return fuelData.map(d => ({ ...d, consumption: d.consumption * 0.6 })); // 40% less fuel
    } else if (filters.fuelType === 'Diesel') {
      return fuelData.map(d => ({ ...d, consumption: d.consumption * 0.85 })); // 15% less fuel
    }
    
    return fuelData;
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
    
    // Generate data based on date range (mpg values)
    if (filters.dateRange === 'This Week' || filters.dateRange === 'Last Week') {
      data = [
        { date: 'Mon', efficiency: 19.5 },
        { date: 'Tue', efficiency: 20.0 },
        { date: 'Wed', efficiency: 19.3 },
        { date: 'Thu', efficiency: 20.2 },
        { date: 'Fri', efficiency: 19.8 },
        { date: 'Sat', efficiency: 20.5 },
        { date: 'Sun', efficiency: 20.0 }
      ];
    } else if (filters.dateRange === 'Last 3 Months') {
      data = [
        { date: 'Jul 23', efficiency: 18.8 },
        { date: 'Aug 6', efficiency: 19.5 },
        { date: 'Aug 20', efficiency: 20.2 },
        { date: 'Sep 3', efficiency: 19.3 },
        { date: 'Sep 17', efficiency: 20.0 },
        { date: 'Oct 1', efficiency: 19.8 },
        { date: 'Oct 15', efficiency: 20.2 },
        { date: 'Oct 21', efficiency: 20.0 }
      ];
    } else if (filters.dateRange === 'This Year') {
      data = [
        { date: 'Jan', efficiency: 18.8 },
        { date: 'Feb', efficiency: 19.3 },
        { date: 'Mar', efficiency: 19.8 },
        { date: 'Apr', efficiency: 19.5 },
        { date: 'May', efficiency: 20.0 },
        { date: 'Jun', efficiency: 20.2 },
        { date: 'Jul', efficiency: 19.8 },
        { date: 'Aug', efficiency: 20.5 },
        { date: 'Sep', efficiency: 20.0 },
        { date: 'Oct', efficiency: 20.2 }
      ];
    } else {
      // This Month / Last Month (default)
      data = [
        { date: 'Sep 21', efficiency: 19.3 },
        { date: 'Sep 28', efficiency: 20.5 },
        { date: 'Oct 5', efficiency: 20.0 },
        { date: 'Oct 12', efficiency: 19.5 },
        { date: 'Oct 19', efficiency: 20.2 }
      ];
    }
    
    // Apply fuel type multiplier
    if (filters.fuelType === 'Diesel') {
      data = data.map(d => ({ ...d, efficiency: d.efficiency * 1.08 }));
    } else if (filters.fuelType === 'Hybrid') {
      data = data.map(d => ({ ...d, efficiency: d.efficiency * 1.45 }));
    }
    
    // Calculate average and create meaningful thresholds with variations
    const efficiencies = data.map(d => d.efficiency);
    const baseAverage = efficiencies.reduce((sum, val) => sum + val, 0) / efficiencies.length;
    
    // Add the reference lines to each data point with slight variations
    return data.map((d, index) => {
      // Create slight variations (+/- 2%) to make lines more realistic
      const avgVariation = 1 + (Math.sin(index * 0.5) * 0.02); // Slight wave pattern
      const best10Variation = 1 + (Math.cos(index * 0.6) * 0.015); // Different wave
      const worst10Variation = 1 + (Math.sin(index * 0.7) * 0.018); // Different wave
      
      const average = baseAverage * avgVariation;
      const best10 = baseAverage * 1.15 * best10Variation;  // 15% above average with variation
      const worst10 = baseAverage * 0.85 * worst10Variation; // 15% below average with variation
      
      return {
        ...d,
        average: average,
        best10: best10,
        worst10: worst10
      };
    });
  };

  const getFilteredAlertsOverTime = () => {
    let data = generateAlertsOverTimeData();
    
    // Adjust based on date range
    if (filters.dateRange === 'This Week' || filters.dateRange === 'Last Week') {
      data = [
        { date: 'Mon', critical: 0, high: 1, medium: 1, low: 0 },
        { date: 'Tue', critical: 1, high: 0, medium: 0, low: 1 },
        { date: 'Wed', critical: 0, high: 2, medium: 1, low: 0 },
        { date: 'Thu', critical: 0, high: 1, medium: 2, low: 0 },
        { date: 'Fri', critical: 1, high: 1, medium: 0, low: 1 },
        { date: 'Sat', critical: 2, high: 0, medium: 1, low: 0 },
        { date: 'Sun', critical: 1, high: 2, medium: 1, low: 1 }
      ];
    } else if (filters.dateRange === 'Last 3 Months') {
      data = [
        { date: 'Jul', critical: 1, high: 2, medium: 3, low: 2 },
        { date: 'Aug', critical: 2, high: 3, medium: 2, low: 1 },
        { date: 'Sep', critical: 1, high: 2, medium: 4, low: 3 },
        { date: 'Oct', critical: 3, high: 3, medium: 2, low: 2 }
      ];
    } else if (filters.dateRange === 'This Year') {
      data = [
        { date: 'Jan', critical: 0, high: 1, medium: 2, low: 1 },
        { date: 'Feb', critical: 1, high: 2, medium: 1, low: 0 },
        { date: 'Mar', critical: 0, high: 1, medium: 3, low: 2 },
        { date: 'Apr', critical: 2, high: 2, medium: 1, low: 1 },
        { date: 'May', critical: 1, high: 1, medium: 2, low: 2 },
        { date: 'Jun', critical: 1, high: 3, medium: 1, low: 1 },
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
    if (filters.dateRange === 'This Week' || filters.dateRange === 'Last Week') {
      data = [
        { date: 'Mon', cost: 62.5 },
        { date: 'Tue', cost: 71.2 },
        { date: 'Wed', cost: 68.9 },
        { date: 'Thu', cost: 65.3 },
        { date: 'Fri', cost: 73.4 },
        { date: 'Sat', cost: 55.8 },
        { date: 'Sun', cost: 41.7 }
      ];
    } else if (filters.dateRange === 'Last 3 Months') {
      data = [
        { date: 'Jul', cost: 58.5 },
        { date: 'Aug', cost: 64.2 },
        { date: 'Sep', cost: 67.8 },
        { date: 'Oct', cost: 69.3 }
      ];
    } else if (filters.dateRange === 'This Year') {
      data = [
        { date: 'Jan', cost: 55.2 },
        { date: 'Feb', cost: 58.4 },
        { date: 'Mar', cost: 61.3 },
        { date: 'Apr', cost: 59.8 },
        { date: 'May', cost: 63.5 },
        { date: 'Jun', cost: 66.7 },
        { date: 'Jul', cost: 58.5 },
        { date: 'Aug', cost: 64.2 },
        { date: 'Sep', cost: 67.8 },
        { date: 'Oct', cost: 69.3 }
      ];
    } else {
      // This Month / Last Month - weekly breakdown
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all hover:shadow-md h-[120px] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[11px] text-gray-700 uppercase tracking-wider font-semibold">{title}</h3>
            {helpId && <InfoTooltip id={helpId} title={helpTitle} description={helpDescription} calculation={helpCalculation} />}
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trendValue && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trendValue}
              </div>
            )}
            {subtitle && <span className="text-xs text-gray-600 font-medium">{subtitle}</span>}
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-gray-800 flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      {alert && (
        <div className={`text-[10px] px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-semibold border self-start ${
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

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 p-3 rounded-lg shadow-xl">
          <p className="text-gray-900 text-sm font-semibold mb-1">{data.category}</p>
          <p className="text-gray-700 text-xs">
            {data.count !== undefined ? `Vehicles: ${data.count}` : 
             data.time !== undefined ? `Time: ${data.time?.toFixed(1)}%` : 
             `Fuel: ${data.fuel?.toFixed(1)}L`}
          </p>
          <p className="text-gray-700 text-xs">
            Percentage: {data.percentage?.toFixed(1)}%
          </p>
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
        helpDescription="Composite score (0-100) combining: (1) MPG Score 30%: Fuel efficiency normalized 10-35 mpg → 0-100. (2) Idle Score 20%: Lower idle% = better, 50% idle = 0 points. (3) Maintenance Score 20%: 100 if no overdue/due alerts, 0 if any alerts. (4) DTC Score 30%: Penalizes active diagnostic faults, each DTC -33 points. Score < 70 indicates inefficient operation."
        helpCalculation="Health = (MPG-10)/25×100×0.3 + (100-idle%×2)×0.2 + MaintenanceStatus×0.2 + (100-DTCs×33)×0.3"
      />
    )},
    { key: 'fuelCost', label: 'Fuel Consumption/100mi', component: (
      <MetricCard
        title="Fuel Consumption"
        value={`${((metrics.fuelCostPerMile / 3.5) * 100).toFixed(1)} L`}
        subtitle="per 100 miles"
        icon={Fuel}
        color="bg-green-900/30 text-green-400"
        trend="up"
        trendValue={`+${((metrics.fuelCostPerMile - metrics.baselineCostPerMile) / metrics.baselineCostPerMile * 100).toFixed(1)}%`}
        alert={metrics.fuelCostPerMile > metrics.baselineCostPerMile ? {
          type: 'warning',
          message: 'Above target'
        } : null}
        helpId="kpi-fuel-consumption"
        helpTitle="Fuel Consumption per 100 Miles"
        helpDescription="Measures the amount of fuel consumed per 100 miles driven across the fleet. This is a standard metric for comparing vehicle efficiency. Lower values indicate better fuel economy."
        helpCalculation="(Total Fuel Used (L) / Distance Traveled (miles)) × 100"
      />
    )},
    { key: 'fuelEfficiency', label: 'Fuel Efficiency', component: (
      <MetricCard
        title="Fuel Efficiency"
        value={filters.fuelType === 'Electric' ? 'N/A' : `${metrics.avgFuelEfficiency} mpg`}
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
        helpCalculation="Distance Traveled / Fuel Used (mpg)"
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
                  description="Tracks actual fuel economy with average, best 10%, and worst 10% thresholds. Green line shows top performance threshold, red line shows bottom 10% threshold. Helps identify if vehicles are performing above or below fleet averages."
                  calculation="Actual: Distance / Fuel | Avg: Mean of all values | Best/Worst: 10th/90th percentiles"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">mpg with performance thresholds</p>
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
                domain={[16, 24]}
              />
              <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#374151' }} />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#6b7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Average"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="best10" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Best 10%"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="worst10" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Worst 10%"
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
      key: 'idleAnalysis',
      label: 'Idle Analysis',
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Idle vs Active Analysis</h3>
                <InfoTooltip 
                  id="plot-idle-analysis"
                  title="Idle vs Active Analysis"
                  description="Combined view of time usage and fuel consumption patterns. Left chart shows percentage of time vehicles spend idle vs active, right chart shows fuel waste from idling."
                  calculation="Time: % of operation time by status | Fuel: Consumption by speed state"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">Status & fuel breakdown</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Time Pie Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 text-center mb-2">Time: Idle vs Active</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart margin={{ top: 0, right: 30, bottom: 0, left: 30 }}>
                  <Pie
                    data={[
                      { category: 'Active', time: 66.7, percentage: 66.7 },
                      { category: 'Idle', time: 33.3, percentage: 33.3 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="time"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Fuel Pie Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 text-center mb-2">Fuel: Moving vs Idle</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart margin={{ top: 0, right: 30, bottom: 0, left: 30 }}>
                  <Pie
                    data={idleVsMovingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="fuel"
                  >
                    {idleVsMovingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'costPerMile',
      label: 'Fuel Consumption per 100mi',
      component: (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Fuel Consumption per 100 Miles</h3>
                <InfoTooltip 
                  id="plot-fuel-consumption-per-100mi"
                  title="Fuel Consumption per 100 Miles by Vehicle Type"
                  description="Compares fuel consumption efficiency across different vehicle classes (Van, Truck, Car). This standard metric helps optimize fleet composition and identify which vehicle types are most fuel-efficient for specific routes or use cases."
                  calculation="(Total Fuel Used / Distance × 100) per vehicle type"
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
              <Bar dataKey="consumption" fill="#06b6d4" radius={[0, 4, 4, 0]} name="L/100mi" />
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
      {/* Header with Filters Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Fleet Overview</h2>
          <InfoTooltip 
            id="dashboard-help"
            title="Dashboard Overview"
            description="This dashboard displays real-time OBD-II data from your fleet. Click (?) icons on any metric or chart to learn more about calculations and thresholds. Alert badges appear when metrics exceed warning thresholds."
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
            {(filters.vehicleType !== 'All' || filters.fuelType !== 'All' || filters.dateRange !== 'This Month') && (
              <span className="w-2 h-2 bg-[#5b4b9d] rounded-full"></span>
            )}
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
                  dateRange: 'This Month'
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

            {/* Date Range */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
              >
                <option value="This Week">This Week</option>
                <option value="Last Week">Last Week</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="This Year">This Year</option>
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
            {filters.dateRange !== 'This Month' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Period: {filters.dateRange}
                <button 
                  onClick={() => setFilters({ ...filters, dateRange: 'This Month' })}
                  className="hover:text-cyan-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.vehicleType === 'All' && filters.fuelType === 'All' && filters.dateRange === 'This Month' && (
              <span className="text-xs text-slate-500 italic">No filters applied (showing all data)</span>
            )}
          </div>
        </div>
      )}


      {/* Filter Applied Banner */}
      {(filters.vehicleType !== 'All' || filters.fuelType !== 'All' || filters.dateRange !== 'This Month') && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5">
          <p className="text-xs text-[#5b4b9d] font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>
              Displaying filtered data: 
              {filters.vehicleType !== 'All' && ` ${filters.vehicleType} vehicles`}
              {filters.fuelType !== 'All' && ` • ${filters.fuelType} fuel type`}
              {filters.dateRange !== 'This Month' && ` • ${filters.dateRange}`}
            </span>
          </p>
        </div>
      )}

      {/* KPI Cards - Dynamic: 4 when chat open, 6 when closed */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isChatOpen ? 'lg:grid-cols-4' : 'lg:grid-cols-6'}`}>
        {availableKPIs
          .filter(kpi => selectedKPIs[kpi.key])
          .slice(0, isChatOpen ? 4 : 6)
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
