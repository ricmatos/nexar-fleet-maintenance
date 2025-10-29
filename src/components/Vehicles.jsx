import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, ChevronDown, ChevronUp, Filter, X, Gauge, Zap, Thermometer, Droplet, Wind, Activity, AlertTriangle, Download, ArrowUpDown, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { generateVehicleData, generateDTCDetails } from '../data/dummyData';

const Vehicles = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDTCDetails, setShowDTCDetails] = useState(null);
  const [showMetricHelp, setShowMetricHelp] = useState(null);
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
    dateRange: 'This Month'
  });

  const allVehicles = generateVehicleData();

  // Generate historical DTCs for a vehicle
  const generateHistoricalDTCs = (vehicleId) => {
    const dtcs = generateDTCDetails(vehicleId);
    const historical = [];
    
    // Generate historical data for each DTC
    dtcs.forEach(dtc => {
      const firstSeen = new Date();
      firstSeen.setDate(firstSeen.getDate() - Math.floor(Math.random() * 30));
      
      // If status is Active, Last Seen should be empty (still active)
      // Otherwise, generate a last seen date
      const isStillActive = dtc.status === 'Active' || Math.random() > 0.3;
      const lastSeen = isStillActive ? null : (() => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 5));
        return date.toISOString().split('T')[0];
      })();
      
      historical.push({
        ...dtc,
        firstSeen: firstSeen.toISOString().split('T')[0],
        lastSeen: lastSeen,
        occurrences: Math.floor(Math.random() * 20) + 1,
        isActive: isStillActive
      });
    });
    
    return historical;
  };

  // Download historical DTCs for a vehicle
  const downloadHistoricalDTCs = (vehicleId) => {
    const historicalDTCs = generateHistoricalDTCs(vehicleId);
    const headers = ['DTC Code', 'Description', 'Severity', 'First Seen', 'Last Seen', 'Occurrences', 'Status'];
    const csvData = historicalDTCs.map(dtc => [
      dtc.code,
      dtc.description,
      dtc.severity,
      dtc.firstSeen,
      dtc.lastSeen || 'Still Active',
      dtc.occurrences,
      dtc.isActive ? 'Active' : 'Resolved'
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vehicleId}_historical_dtcs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Download CSV function
  const downloadCSV = () => {
    const headers = ['Vehicle ID', 'VIN', 'Type', 'Fuel Type', 'Camera SN', 'Status', 'Health', 'Fuel Consumption (L/100mi)', 'Efficiency (mpg)', 'Fuel Daily', 'Moving/Idle', 'Alerts'];
    const csvData = allVehicles.map(v => [
      v.id,
      v.vin,
      v.type,
      v.fuelType,
      v.cameraSN,
      v.status,
      v.healthIndex,
      ((v.fuelCostPerMile / 3.5) * 100).toFixed(1),
      v.avgFuelEfficiency,
      v.fuelConsumptionDaily,
      `${v.fuelMoving}/${v.fuelIdle}`,
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
      case 'costMile':
        aValue = a.fuelCostPerMile;
        bValue = b.fuelCostPerMile;
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
    let dataPoints, timeLabel;
    
    switch (filters.dateRange) {
      case 'This Week':
      case 'Last Week':
        dataPoints = 7;
        break;
      case 'This Month':
      case 'Last Month':
        dataPoints = 30;
        break;
      case 'Last 3 Months':
        dataPoints = 90;
        break;
      case 'This Year':
        dataPoints = 12;
        break;
      default:
        dataPoints = 30;
    }
    
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
      if (filters.dateRange === 'This Year') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        timeLabel = months[i];
      } else if (filters.dateRange === 'Last 3 Months') {
        timeLabel = `Day ${i + 1}`;
      } else {
        timeLabel = `Day ${i + 1}`;
      }
      
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
        speed: vehicle.status === 'Active' ? vehicle.speedMph + (Math.random() - 0.5) * 6 : 0,
        odometer: vehicle.odometerMiles + (i * 1.5), // Gradual increase
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
            {filters.dateRange !== 'This Month' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-[#5b4b9d] border border-purple-300 rounded-md text-xs font-medium">
                Period: {filters.dateRange}
                <button onClick={() => setFilters({ ...filters, dateRange: 'This Month' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.vehicleType === 'All' && filters.status === 'All' && filters.fuelType === 'All' && filters.alertSeverity === 'All' && filters.dateRange === 'This Month' && (
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
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleSort('health')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                      Health
                      {sortColumn === 'health' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </button>
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMetricHelp(showMetricHelp === 'health' ? null : 'health');
                        }}
                        className="text-gray-400 hover:text-[#5b4b9d] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {showMetricHelp === 'health' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMetricHelp(null)} />
                          <div className="absolute z-50 left-0 top-6 w-96 bg-white border border-purple-200 rounded-xl p-4 shadow-2xl">
                            <h4 className="text-sm font-semibold text-[#5b4b9d] mb-3">Health Index (0-100)</h4>
                            <p className="text-xs text-gray-900 leading-relaxed mb-3">
                              Composite score combining four key metrics:
                            </p>
                            <div className="space-y-2 mb-3">
                              <div className="text-xs">
                                <span className="font-semibold text-gray-900">1. MPG Score (30%):</span>
                                <p className="text-gray-700 ml-3">Fuel efficiency: (vehicle MPG - 10) ÷ 25 × 100<br/>
                                <span className="text-gray-500 italic">10 mpg = 0 pts, 22.5 mpg = 50 pts, 35+ mpg = 100 pts</span></p>
                              </div>
                              <div className="text-xs">
                                <span className="font-semibold text-gray-900">2. Idle Score (20%):</span>
                                <p className="text-gray-700 ml-3">100 - (idle percentage × 2)<br/>
                                <span className="text-gray-500 italic">0% idle = 100 pts, 25% = 50 pts, 50%+ = 0 pts</span></p>
                              </div>
                              <div className="text-xs">
                                <span className="font-semibold text-gray-900">3. Maintenance (20%):</span>
                                <p className="text-gray-700 ml-3">100 if no alerts, 0 if any overdue/due maintenance</p>
                              </div>
                              <div className="text-xs">
                                <span className="font-semibold text-gray-900">4. DTC Score (30%):</span>
                                <p className="text-gray-700 ml-3">100 - (active DTCs × 33)<br/>
                                <span className="text-gray-500 italic">0 DTCs = 100 pts, 1 DTC = 67 pts, 2 = 34 pts, 3+ = 0 pts</span></p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 font-semibold mb-1 border-t border-gray-200 pt-2">FORMULA:</p>
                            <p className="text-xs text-indigo-700 font-mono bg-indigo-50 p-2 rounded">
                              Health = (MPG-10)/25×100×0.3 + (100-idle%×2)×0.2 + Maint×0.2 + (100-DTCs×33)×0.3
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleSort('costMile')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                      Fuel/100mi
                      {sortColumn === 'costMile' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </button>
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMetricHelp(showMetricHelp === 'costMile' ? null : 'costMile');
                        }}
                        className="text-gray-400 hover:text-[#5b4b9d] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {showMetricHelp === 'costMile' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMetricHelp(null)} />
                          <div className="absolute z-50 left-0 top-6 w-80 bg-white border border-purple-200 rounded-xl p-4 shadow-2xl">
                            <h4 className="text-sm font-semibold text-[#5b4b9d] mb-3">Fuel Consumption per 100 Miles</h4>
                            <p className="text-xs text-gray-900 leading-relaxed mb-3">
                              Fuel efficiency metric showing how many liters of fuel this vehicle consumes per 100 miles traveled. Lower values indicate better fuel economy. Critical for fleet efficiency optimization and identifying vehicles with excessive consumption.
                            </p>
                            <p className="text-xs text-gray-600 font-semibold mb-1">CALCULATION:</p>
                            <p className="text-xs text-indigo-700 font-mono">
                              (Total Fuel Used (L) ÷ Distance Traveled (miles)) × 100
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleSort('efficiency')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                      Efficiency
                      {sortColumn === 'efficiency' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </button>
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMetricHelp(showMetricHelp === 'efficiency' ? null : 'efficiency');
                        }}
                        className="text-gray-400 hover:text-[#5b4b9d] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {showMetricHelp === 'efficiency' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMetricHelp(null)} />
                          <div className="absolute z-50 left-0 top-6 w-80 bg-white border border-purple-200 rounded-xl p-4 shadow-2xl">
                            <h4 className="text-sm font-semibold text-[#5b4b9d] mb-3">Fuel Efficiency</h4>
                            <p className="text-xs text-gray-900 leading-relaxed mb-3">
                              Average miles per gallon (mpg). Key metric for identifying fuel-inefficient vehicles, poor driving habits, or mechanical issues affecting consumption.
                            </p>
                            <p className="text-xs text-gray-600 font-semibold mb-1">CALCULATION:</p>
                            <p className="text-xs text-indigo-700 font-mono">
                              Distance (miles) ÷ Fuel Used (gallons) | From: Speed (PID 01-0D), MAF (PID 01-10), Fuel Rate (PID 01-5E)
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleSort('fuelDaily')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                      Fuel Daily
                      {sortColumn === 'fuelDaily' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </button>
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMetricHelp(showMetricHelp === 'fuelDaily' ? null : 'fuelDaily');
                        }}
                        className="text-gray-400 hover:text-[#5b4b9d] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {showMetricHelp === 'fuelDaily' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMetricHelp(null)} />
                          <div className="absolute z-50 left-0 top-6 w-80 bg-white border border-purple-200 rounded-xl p-4 shadow-2xl">
                            <h4 className="text-sm font-semibold text-[#5b4b9d] mb-3">Daily Fuel Consumption</h4>
                            <p className="text-xs text-gray-900 leading-relaxed mb-3">
                              Total liters of fuel consumed per day, combining both moving and idle consumption. Useful for tracking fuel usage patterns and identifying vehicles with excessive consumption.
                            </p>
                            <p className="text-xs text-gray-600 font-semibold mb-1">CALCULATION:</p>
                            <p className="text-xs text-indigo-700 font-mono">
                              Σ Fuel Flow Rate (PID 01-5E) × Engine Runtime (PID 01-1F) over 24h
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleSort('movingIdle')} className="flex items-center gap-1 hover:text-[#5b4b9d] transition-colors">
                      Moving/Idle
                      {sortColumn === 'movingIdle' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </button>
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMetricHelp(showMetricHelp === 'movingIdle' ? null : 'movingIdle');
                        }}
                        className="text-gray-400 hover:text-[#5b4b9d] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {showMetricHelp === 'movingIdle' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMetricHelp(null)} />
                          <div className="absolute z-50 left-0 top-6 w-80 bg-white border border-purple-200 rounded-xl p-4 shadow-2xl">
                            <h4 className="text-sm font-semibold text-[#5b4b9d] mb-3">Moving vs Idle Fuel</h4>
                            <p className="text-xs text-gray-900 leading-relaxed mb-3">
                              Breakdown of fuel consumption between productive movement and non-productive idling. High idle fuel indicates potential waste from extended idle times, impacting operational costs.
                            </p>
                            <p className="text-xs text-gray-600 font-semibold mb-1">CALCULATION:</p>
                            <p className="text-xs text-indigo-700 font-mono">
                              Fuel when Speed (PID 01-0D) &gt; 0 vs Speed = 0 | Fuel Flow: PID 01-5E
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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
                    <td className="px-4 py-4 text-gray-900 font-medium">{((vehicle.fuelCostPerMile / 3.5) * 100).toFixed(1)}L</td>
                    <td className="px-4 py-4 text-gray-900 font-medium">{vehicle.avgFuelEfficiency} mpg</td>
                    <td className="px-4 py-4 text-gray-900 font-medium">{vehicle.fuelConsumptionDaily.toFixed(1)}L</td>
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {vehicle.fuelMoving.toFixed(1)}L / {vehicle.fuelIdle.toFixed(1)}L
                    </td>
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
                            <div className="text-xs text-gray-500 italic">
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
                                  <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} name="Speed (mph)" dot={false} />
                                  <Line yAxisId="right" type="monotone" dataKey="odometer" stroke="#10b981" strokeWidth={2} name="Odometer (miles)" dot={false} />
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

                            {/* Chart 6: Active Alerts */}
                            <div 
                              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                  <h5 className="text-sm font-bold text-gray-900">Active Alerts (DTCs and Faults)</h5>
                                </div>
                                <button
                                  onClick={() => setShowDTCDetails(showDTCDetails === vehicle.id ? null : vehicle.id)}
                                  className="px-3 py-1 bg-[#5b4b9d] text-white rounded-lg hover:bg-[#6d5ba7] transition-colors text-xs font-semibold"
                                >
                                  Get Alerts History
                                </button>
                              </div>
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={generateTimeSeriesData(vehicle)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} />
                                  <YAxis stroke="#374151" style={{ fontSize: '10px', fontWeight: '600' }} domain={[0, 5]} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600', color: '#374151' }} />
                                  <Line type="monotone" dataKey="dtcCount" stroke="#dc2626" strokeWidth={2} name="Alert Count" dot={{ fill: '#dc2626', r: 3 }} />
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
                              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[80vh] overflow-auto">
                                <div className="bg-white border border-red-200 rounded-xl p-6 shadow-2xl">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                      <AlertTriangle className="w-5 h-5 text-red-500" />
                                      Active Alerts (DTCs and Faults) - {vehicle.id}
                                    </h5>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          downloadHistoricalDTCs(vehicle.id);
                                        }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#5b4b9d] text-white rounded-lg hover:bg-[#6d5ba7] transition-colors text-xs font-semibold"
                                        title="Download Historical Alerts"
                                      >
                                        <Download className="w-4 h-4" />
                                        Download History
                                      </button>
                                      <button
                                        onClick={() => setShowDTCDetails(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mb-4 text-xs text-gray-600 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                                    📅 Data range: {filters.dateRange}
                                  </div>
                                  {generateHistoricalDTCs(vehicle.id).length > 0 ? (
                                    <div className="space-y-2">
                                      {generateHistoricalDTCs(vehicle.id).map((dtc, idx) => (
                                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                          <div className="flex items-start gap-2 mb-2">
                                            <span className="font-mono text-sm font-bold text-gray-900">{dtc.code}</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                              dtc.severity === 'Critical'
                                                ? 'bg-red-100 text-red-700'
                                                : dtc.severity === 'High'
                                                ? 'bg-orange-100 text-orange-700'
                                                : dtc.severity === 'Medium'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                              {dtc.severity}
                                            </span>
                                            <span className="text-sm text-gray-700 font-medium flex-1">{dtc.description}</span>
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            <span className="font-semibold">First Seen:</span> {dtc.firstSeen}
                                            <span className="mx-2">•</span>
                                            <span className="font-semibold">Last Seen:</span> {dtc.lastSeen || <span className="text-emerald-600 font-semibold">Still Active</span>}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-12 text-gray-500">
                                      <AlertTriangle className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                                      <p className="text-base font-semibold">No active alerts detected</p>
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
                                <div className="text-sm font-bold text-gray-900">{vehicle.speedMph} mph</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Odometer</div>
                                <div className="text-sm font-bold text-gray-900">{vehicle.odometerMiles.toLocaleString()} mi</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-semibold">Alerts</div>
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
