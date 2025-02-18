import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Switch } from "@/components/ui/switch";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({ temperature: 0, humidity: 0, ph: 0, ec: 0 });
  const [pumpOn, setPumpOn] = useState(false);
  const [nutrientOn, setNutrientOn] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://saladlover.onrender.com/data");
      const data = await response.json();
      setSensorData(data.data);
      setHistory((prev) => [...prev.slice(-20), data.data]);
    };
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gradient-to-b from-blue-200 to-green-200 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-green-700">ระบบควบคุม AI Hydroponics</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card className="bg-white shadow-md p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">สถานะเซ็นเซอร์</h2>
            <p>อุณหภูมิ: {sensorData.temperature}°C</p>
            <p>ความชื้น: {sensorData.humidity}%</p>
            <p>ค่า pH: {sensorData.ph}</p>
            <p>EC: {sensorData.ec}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">ควบคุมระบบ</h2>
            <div className="flex items-center justify-between mt-2">
              <span>ปั๊มน้ำ</span>
              <Switch checked={pumpOn} onCheckedChange={setPumpOn} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span>จ่ายสารอาหาร</span>
              <Switch checked={nutrientOn} onCheckedChange={setNutrientOn} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg font-semibold">ข้อมูลย้อนหลัง</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
            <Line type="monotone" dataKey="humidity" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
