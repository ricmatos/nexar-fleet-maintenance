import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, ChevronDown, ChevronUp, Filter, X, Gauge, Zap, Thermometer, Droplet, Wind, Activity, AlertTriangle, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { generateVehicleData, generateDTCDetails } from '../data/dummyData';

const Vehicles = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDTCDetails, setShowDTCDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const rowsPerPage = 20;
  const [filters, setFilters] = useState({
    vehicleType: 'All',
    status: 'All',
    fuelType: 'All',
    alertSeverity: 'All',
    dateRange: 'Last 24 hours'
  });

  const allVehicles = generateVehicleData();

  // Download CSV function
  const downloadCSV = () => {
    const headers = ['Vehicle ID', 'VIN', 'Type', 'Fuel Type', 'Camera SN', 'Status', 'Health', 'Cost/km', 'Efficiency', 'Fuel Daily', 'Moving/Idle', 'Cost Daily', 'Alerts'];
    const csvData = allVehicles.map(v => [
      v.id,
      v.vin,
      v.type,
      v.fuelType,
      v.cameraSN,
      v.status,
      v.healthIndex,
      v.fuelCostPerKm,
      v.avgFuelEfficiency,
      v.fuelConsumptionDaily,
      `${v.fuelMoving}/${v.fuelIdle}`,
      v.totalFuelCostDaily,
      v.alerts.map(a => a.type).join('; ')
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet_vehicles_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Sorting function
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Apply filters
  const filteredVehicles = allVehicles.filter(vehicle => {
    // Search filter
    if (searchTerm && !vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !vehicle.cameraSN.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Vehicle type filter
    if (filters.vehicleType !== 'All' && vehicle.type !== filters.vehicleType) {
      return false;
    }

    // Status filter
    if (filters.status !== 'All' && vehicle.status !== filters.status) {
      return false;
    }

    // Fuel type filter
    if (filters.fuelType !== 'All' && vehicle.fuelType !== filters.fuelType) {
      return false;
    }

    // Alert severity filter
    if (filters.alertSeverity !== 'All') {
      const hasMatchingSeverity = vehicle.alerts.some(alert => alert.severity === filters.alertSeverity);
      if (!hasMatchingSeverity) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue, bValue;
    switch (sortColumn) {
      case 'health':
        aValue = a.healthIndex;
        bValue = b.healthIndex;
        break;
      case 'costKm':
        aValue = a.fuelCostPerKm;
        bValue = b.fuelCostPerKm;
        break;
      case 'efficiency':
        aValue = a.avgFuelEfficiency;
        bValue = b.avgFuelEfficiency;
        break;
      case 'fuelDaily':
        aValue = a.fuelConsumptionDaily;
        bValue = b.fuelConsumptionDaily;
        break;
      case 'movingIdle':
        aValue = a.fuelMoving + a.fuelIdle;
        bValue = b.fuelMoving + b.fuelIdle;
        break;
      case 'costDaily':
        aValue = a.totalFuelCostDaily;
        bValue = b.totalFuelCostDaily;
        break;
      case 'alerts':
        aValue = a.alerts.length;
        bValue = b.alerts.length;
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedVehicles.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedVehicles = sortedVehicles.slice(startIndex, endIndex);

  const toggleRow = (vehicleId) => {
    setExpandedRow(expandedRow === vehicleId ? null : vehicleId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-600';
      case 'Idle':
        return 'bg-yellow-50 text-yellow-700 border-yellow-600';
      case 'In Service':
        return 'bg-gray-50 text-gray-700 border-gray-600';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-600';
    }
  };

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

  const getHealthColor = (health) => {
    if (health >= 80) return 'text-emerald-400';
    if (health >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Generate time-series data for charts based on date range
  const generateTimeSeriesData = (vehicle) => {
    const dataPoints = filters.dateRange === 'Last 24 hours' ? 24 : 
                       filters.dateRange === 'Last 7 days' ? 7 : 30;
    
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
      const timeLabel = filters.dateRange === 'Last 24 hours' 
        ? `${i}:00` 
        : filters.dateRange === 'Last 7 days'
        ? `Day ${i + 1}`
        : `Day ${i + 1}`;
      
      data.push({
        time: timeLabel,
        // Engine metrics with realistic variations
        rpm: vehicle.status === 'Active' ? vehicle.engineRPM + (Math.random() - 0.5) * 200 : 0,
        load: vehicle.status === 'Active' ? vehicle.engineLoad + (Math.random() - 0.5) * 10 : 0,
        torque: vehicle.status === 'Active' ? vehicle.engineTorque + (Math.random() - 0.5) * 20 : 0,
        
        // Temperature metrics
        coolant: vehicle.coolantTemp + (Math.random() - 0.5) * 5,
        iat: vehicle.intakeAirTemp + (Math.random() - 0.5) * 3,
        ambient: vehicle.ambientTemp + (Math.random() - 0.5) * 2,
        
        // Electrical & Pressure
        battery: vehicle.batteryVoltage + (Math.random() - 0.5) * 0.3,
        oilPressure: vehicle.oilPressure + (Math.random() - 0.5) * 5,
        barometric: vehicle.barometricPressure + (Math.random() - 0.5) * 0.5,
        
        // Fuel metrics
        fuelLevel: Math.max(0, vehicle.fuelLevel - (i * 0.5)),
        defLevel: vehicle.defLevel ? Math.max(0, vehicle.defLevel - (i * 0.1)) : null,
        
        // Vehicle motion & diagnostics
        speed: vehicle.status === 'Active' ? vehicle.speedKmh + (Math.random() - 0.5) * 10 : 0,
        odometer: vehicle.odometerKm + (i * 2.5), // Gradual increase
        dtcCount: vehicle.activeDTCs + Math.floor(Math.random() * 2) // Occasional DTC changes
      });
    }
    return data;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 p-3 rounded-lg shadow-xl">
          {payload.map((entry, index) => (
            <p key={index} className="text-xs text-gray-900 font-medium" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Search, Pagination, Filters, and Export */}
      <div className="flex items-center justify-between gap-4">
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
        <div className="flex items-center gap-3">
          {totalPages > 1 && (
            <div className="flex items-center gap-1 text-sm text-gray-600 font-semibold">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="hover:text-[#5b4b9d] disabled:opacity-30"
              >
                &lt;
              </button>
              <span>Page {currentPage}/{totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="hover:text-[#5b4b9d] disabled:opacity-30"
              >
                &gt;
              </button>
            </div>
          )}
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
              {(filters.vehicleType !== 'All' || filters.status !== 'All' || filters.fuelType !== 'All' || filters.alertSeverity !== 'All') && (
              <span className="w-2 h-2 bg-[#5b4b9d] rounded-full"></span>
            )}
          </button>
          <button
            onClick={downloadCSV}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            title="Export to CSV"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#5b4b9d]" />
              Filter Vehicles
            </h3>
            <button
              onClick={() => {
                setFilters({
                  vehicleType: 'All',
                  status: 'All',
                  fuelType: 'All',
                  alertSeverity: 'All'
                });
              }}
              className="text-xs text-[#5b4b9d] font-semibold hover:text-[#6d5ba7] transition-colors"
            >
              Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Vehicle Type */}
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

            {/* Status */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="In Service">In Service</option>
              </select>
            </div>

            {/* Fuel Type */}
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

            {/* Alert Severity */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2">Alert Severity</label>
              <select
                value={filters.alertSeverity}
                onChange={(e) => setFilters({ ...filters, alertSeverity: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Date Range for Metrics */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2">Metrics Scope</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#5b4b9d] focus:ring-1 focus:ring-[#5b4b9d] transition-colors"
              >
                <option value="Last 24 hours">Last 24 hours</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600 font-medium">Active filters:</span>
            {filters.vehicleType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Type: {filters.vehicleType}
                <button onClick={() => setFilters({ ...filters, vehicleType: 'All' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Status: {filters.status}
                <button onClick={() => setFilters({ ...filters, status: 'All' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.fuelType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Fuel: {filters.fuelType}
                <button onClick={() => setFilters({ ...filters, fuelType: 'All' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.alertSeverity !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Alert: {filters.alertSeverity}
                <button onClick={() => setFilters({ ...filters, alertSeverity: 'All' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dateRange !== 'Last 24 hours' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Period: {filters.dateRange}
                <button onClick={() => setFilters({ ...filters, dateRange: 'Last 24 hours' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.vehicleType === 'All' && filters.status === 'All' && filters.fuelType === 'All' && filters.alertSeverity === 'All' && filters.dateRange === 'Last 24 hours' && (
              <span className="text-xs text-gray-500 italic">No filters applied</span>
            )}
          </div>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-700 font-bold border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-bold w-10"></th>
                <th className="px-4 py-3 font-bold">Vehicle / VIN</th>
                <th className="px-4 py-3 font-bold">Type / Fuel</th>
                <th className="px-4 py-3 font-bold">Camera SN</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">
                  <button onClick={() => handleSort('health')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                    Health
                    {sortColumn === 'health' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-bold">
                  <button onClick={() => handleSort('costKm')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                    Cost/km
                    {sortColumn === 'costKm' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-bold">
                  <button onClick={() => handleSort('efficiency')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                    Efficiency
                    {sortColumn === 'efficiency' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-bold">
                  <button onClick={() => handleSort('fuelDaily')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                    Fuel Daily
                    {sortColumn === 'fuelDaily' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-bold">
                  <button onClick={() => handleSort('movingIdle')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                    Moving/Idle
                    {sortColumn === 'movingIdle' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-bold">
                  <button onClick={() => handleSort('costDaily')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                    Cost Daily
                    {sortColumn === 'costDaily' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-bold">
                  <button onClick={() => handleSort('alerts')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                    Alerts
                    {sortColumn === 'alerts' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedVehicles.map((vehicle) => (
                <React.Fragment key={vehicle.id}>
                  {/* Main Row */}
                  <tr 
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleRow(vehicle.id)}
                  >
                    <td className="px-4 py-4">
                      <button className="text-gray-400 hover:text-gray-700">
                        {expandedRow === vehicle.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-bold text-gray-900">{vehicle.id}</div>
                        <div className="text-xs text-gray-600 font-medium">{vehicle.vin}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm text-gray-900 font-semibold">{vehicle.type}</div>
                        <div className="text-xs text-gray-600 font-medium">{vehicle.fuelType}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-900 font-medium">{vehicle.cameraSN}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-semibold ${getHealthColor(vehicle.healthIndex)}`}>
                        {vehicle.healthIndex}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-900 font-medium">${vehicle.fuelCostPerKm.toFixed(2)}</td>
                    <td className="px-4 py-4 text-gray-900 font-medium">{vehicle.avgFuelEfficiency} km/L</td>
                    <td className="px-4 py-4 text-gray-900 font-medium">{vehicle.fuelConsumptionDaily.toFixed(1)}L</td>
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {vehicle.fuelMoving.toFixed(1)}L / {vehicle.fuelIdle.toFixed(1)}L
                    </td>
                    <td className="px-4 py-4 text-gray-900 font-medium">${vehicle.totalFuelCostDaily.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {vehicle.alerts.length > 0 ? (
                          vehicle.alerts.map((alert, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${getSeverityColor(alert.severity)}`}
                            >
                              {alert.type}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 font-medium">No alerts</span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details Row with Time-Series Charts */}
                  {expandedRow === vehicle.id && (
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <td colSpan="12" className="px-4 py-6">
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-900">
                              Telematics Trends - {filters.dateRange}
                            </h4>
                            <div className="text-xs text-gray-500">
                              Current values shown in real-time
                            </div>
                          </div>

                          {/* Charts Grid - 3x2 = 6 plots */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Chart 1: Engine Performance - RPM & Load % (Dual Y-Axis) */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                <h5 className="text-sm font-bold text-gray-900">Engine Performance</h5>
                              </div>
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={generateTimeSeriesData(vehicle)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis yAxisId="left" stroke="#0e7490" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis yAxisId="right" orientation="right" stroke="#047857" style={{ fontSize: '10px', fontWeight: '600' }} domain={[0, 100]} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600', color: '#374151' }} iconType="line" />
                                  <Line yAxisId="left" type="monotone" dataKey="rpm" stroke="#06b6d4" strokeWidth={2} name="RPM" dot={false} />
                                  <Line yAxisId="right" type="monotone" dataKey="load" stroke="#10b981" strokeWidth={2} name="Load %" dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Chart 2: Battery Voltage */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <h5 className="text-sm font-bold text-gray-900">Battery Voltage</h5>
                              </div>
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={generateTimeSeriesData(vehicle)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} domain={[11, 14]} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600', color: '#374151' }} iconType="circle" />
                                  <Line type="monotone" dataKey="battery" stroke="#eab308" strokeWidth={2} name="Battery (V)" dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Chart 3: Speed & Odometer (Dual Y-Axis) */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-4 h-4 text-blue-500" />
                                <h5 className="text-sm font-bold text-gray-900">Speed & Odometer</h5>
                              </div>
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={generateTimeSeriesData(vehicle)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis yAxisId="left" stroke="#3b82f6" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600', color: '#374151' }} iconType="line" />
                                  <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} name="Speed (km/h)" dot={false} />
                                  <Line yAxisId="right" type="monotone" dataKey="odometer" stroke="#10b981" strokeWidth={2} name="Odometer (km)" dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Chart 4: Temperature Monitoring */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <Thermometer className="w-4 h-4 text-red-400" />
                                <h5 className="text-sm font-bold text-gray-900">Temperature Monitoring</h5>
                              </div>
                              <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={generateTimeSeriesData(vehicle)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600', color: '#374151' }} iconType="square" />
                                  <Area type="monotone" dataKey="coolant" stroke="#ef4444" fill="#ef444420" strokeWidth={2} name="Coolant (°C)" />
                                  <Area type="monotone" dataKey="iat" stroke="#f59e0b" fill="#f59e0b20" strokeWidth={2} name="IAT (°C)" />
                                  <Area type="monotone" dataKey="ambient" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} name="Ambient (°C)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Chart 5: Pressure Monitoring (Oil & Barometric) */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <Wind className="w-4 h-4 text-purple-400" />
                                <h5 className="text-sm font-bold text-gray-900">Pressure Monitoring</h5>
                              </div>
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={generateTimeSeriesData(vehicle)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis yAxisId="left" stroke="#6d28d9" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis yAxisId="right" orientation="right" stroke="#0e7490" style={{ fontSize: '10px', fontWeight: '600' }} domain={[100, 102]} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600', color: '#374151' }} iconType="line" />
                                  <Line yAxisId="left" type="monotone" dataKey="oilPressure" stroke="#8b5cf6" strokeWidth={2} name="Oil Pressure (psi)" dot={false} />
                                  <Line yAxisId="right" type="monotone" dataKey="barometric" stroke="#06b6d4" strokeWidth={2} name="Barometric (kPa)" dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Chart 6: Active DTCs */}
                            <div 
                              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer hover:border-purple-300 transition-colors"
                              onClick={() => setShowDTCDetails(showDTCDetails === vehicle.id ? null : vehicle.id)}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <h5 className="text-sm font-bold text-gray-900">Active DTCs</h5>
                              </div>
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={generateTimeSeriesData(vehicle)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} domain={[0, 5]} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600', color: '#374151' }} />
                                  <Line type="monotone" dataKey="dtcCount" stroke="#dc2626" strokeWidth={2} name="DTC Count" dot={{ fill: '#dc2626', r: 3 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* DTC Details Modal/Popup */}
                          {showDTCDetails === vehicle.id && (
                            <>
                              <div 
                                className="fixed inset-0 bg-black/50 z-50" 
                                onClick={() => setShowDTCDetails(null)}
                              />
                              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-auto">
                                <div className="bg-white border border-red-200 rounded-xl p-6 shadow-2xl">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                      <AlertTriangle className="w-5 h-5 text-red-500" />
                                      Diagnostic Trouble Codes - {vehicle.id}
                                    </h5>
                                    <button
                                      onClick={() => setShowDTCDetails(null)}
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>
                                  {generateDTCDetails(vehicle.id).length > 0 ? (
                                    <div className="space-y-3">
                                      {generateDTCDetails(vehicle.id).map((dtc, idx) => (
                                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                              <div className="font-mono text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-300">
                                                {dtc.code}
                                              </div>
                                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                                                dtc.severity === 'Critical'
                                                  ? 'bg-red-50 text-red-700 border-red-600'
                                                  : dtc.severity === 'High'
                                                  ? 'bg-orange-50 text-orange-700 border-orange-600'
                                                  : dtc.severity === 'Medium'
                                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-600'
                                                  : 'bg-blue-50 text-blue-700 border-blue-600'
                                              }`}>
                                                {dtc.severity}
                                              </span>
                                              <span className="text-xs text-gray-500 font-medium">{dtc.status}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{dtc.timestamp}</div>
                                          </div>
                                          <p className="text-sm text-gray-700 font-medium">{dtc.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-12 text-gray-500">
                                      <AlertTriangle className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                                      <p className="text-base font-semibold">No active DTCs detected</p>
                                      <p className="text-sm">This vehicle is operating normally</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Current Values Summary */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Current Values</h5>
                            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">RPM</div>
                                <div className="text-sm font-bold text-gray-900">{vehicle.engineRPM}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Load</div>
                                <div className="text-sm font-bold text-gray-900">{vehicle.engineLoad}%</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Torque</div>
                                <div className="text-sm font-bold text-gray-900">{vehicle.engineTorque} Nm</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Battery</div>
                                <div className={`text-sm font-bold ${vehicle.batteryVoltage < 12 ? 'text-red-500' : 'text-gray-900'}`}>
                                  {vehicle.batteryVoltage} V
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Coolant</div>
                                <div className={`text-sm font-bold ${vehicle.coolantTemp > 105 ? 'text-red-500' : 'text-gray-900'}`}>
                                  {vehicle.coolantTemp}°C
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Oil Pressure</div>
                                <div className={`text-sm font-bold ${vehicle.oilPressure < 20 && vehicle.oilPressure > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                  {vehicle.oilPressure} psi
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Speed</div>
                                <div className="text-sm font-bold text-gray-900">{vehicle.speedKmh} km/h</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Odometer</div>
                                <div className="text-sm font-bold text-gray-900">{vehicle.odometerKm.toLocaleString()} km</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">DTCs</div>
                                <div className={`text-sm font-bold ${vehicle.activeDTCs > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                  {vehicle.activeDTCs}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedVehicles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No vehicles found matching your filters.
        </div>
      )}
    </div>
  );
};

export default Vehicles;
