import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  Camera,
  Calendar,
  DollarSign,
  Package,
  Loader2,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";

// StatCard Component
const StatCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="w-4 h-4 text-[#704e81]" />
    </div>
    <div className="text-2xl font-bold text-[#704e81]">{value}</div>
    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
  </div>
);

// ProductCategoryChart Component
const ProductCategoryChart = ({ data }) => {
  const COLORS = ['#704e81', '#9b8aa6', '#b8adc4', '#d6d1dd'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Category Distribution</h3>
      <div className="h-[50px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Category</th>
              <th className="text-right py-2">Products</th>
              <th className="text-right py-2">Total Stock</th>
              <th className="text-right py-2">Avg. Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{category.name}</td>
                <td className="text-right">{category.value}</td>
                <td className="text-right">{category.total_stock}</td>
                <td className="text-right">${category.average_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main BusinessDashboard Component
const BusinessDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    sessionStatus: [],
    sessionMonthly: [],
    paymentSummary: null,
    paymentMonthly: [],
    productSummary: null,
    productCategories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          'sessions/status',
          'sessions/monthly',
          'payments/summary',
          'payments/monthly',
          'products/summary',
          'products/categories'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => 
            fetch(`http://localhost:3000/api/${endpoint}`)
              .then(res => res.json())
          )
        );

        setStats({
          sessionStatus: responses[0],
          sessionMonthly: responses[1],
          paymentSummary: responses[2],
          paymentMonthly: responses[3],
          productSummary: responses[4],
          productCategories: responses[5],
        });
        setError(null);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#704e81]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Business Statistics</h1>
        <p className="text-gray-600">Overview of sessions, payments, and products</p>
      </div>

      {/* Sessions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Photography Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.sessionStatus.map((status, index) => (
            <StatCard
              key={status.name}
              title={`${status.name} Sessions`}
              value={status.value}
              subtitle="Active sessions"
              icon={Calendar}
            />
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Session Trends</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.sessionMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total_sessions"
                  stroke="#704e81"
                  name="Total Sessions"
                />
                <Line
                  type="monotone"
                  dataKey="average_price"
                  stroke="#9b8aa6"
                  name="Average Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payments Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Revenue"
            value={`$${stats.paymentSummary?.total_payments.toLocaleString()}`}
            subtitle="All time revenue"
            icon={DollarSign}
          />
          <StatCard
            title="Platform Profit"
            value={`$${stats.paymentSummary?.total_platform_profit.toLocaleString()}`}
            subtitle="Platform earnings"
            icon={BarChart2}
          />
          <StatCard
            title="Photographer Earnings"
            value={`$${stats.paymentSummary?.total_photographer_profit.toLocaleString()}`}
            subtitle="Total photographer payments"
            icon={Camera}
          />
          <StatCard
            title="Average Payment"
            value={`$${stats.paymentSummary?.average_payment.toLocaleString()}`}
            subtitle="Per transaction"
            icon={TrendingUp}
          />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.paymentMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="platform_profit" fill="#704e81" name="Platform Profit" />
                <Bar dataKey="photographer_profit" fill="#9b8aa6" name="Photographer Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Products"
            value={stats.productSummary?.total_products}
            subtitle="Active products"
            icon={Package}
          />
          <StatCard
            title="Total Stock"
            value={stats.productSummary?.total_stock}
            subtitle="Available units"
            icon={Package}
          />
          <StatCard
            title="Average Price"
            value={`$${stats.productSummary?.average_price}`}
            subtitle="Per product"
            icon={DollarSign}
          />
          <StatCard
            title="Categories"
            value={stats.productSummary?.category_count}
            subtitle="Product categories"
            icon={PieChartIcon}
          />
        </div>
        
        {/* Product Category Chart */}
        <ProductCategoryChart data={stats.productCategories} />
      </div>
    </div>
  );
};

export default BusinessDashboard;