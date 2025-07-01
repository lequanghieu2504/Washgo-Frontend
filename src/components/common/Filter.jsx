import React, { useState, useEffect } from "react";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "interior", label: "Interior wash" },
  { value: "exterior", label: "Exterior wash" },
  { value: "full", label: "Full wash" },
];

// Generate time options: every 30 minutes from 7:00 to 21:30
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 7; hour <= 21; hour++) {
    options.push(
      { value: `${hour}:00`, label: `${hour}:00` },
      { value: `${hour}:30`, label: `${hour}:30` }
    );
  }
  return options;
};

const timeOptions = generateTimeOptions();

export default function Filter({ onChange, category }) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("");
  const [filterCategory, setFilterCategory] = useState(category || "");

  // Effect: set category from URL query if substring of any category label
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q") || "";
    const lowerQuery = query.toLowerCase();

    if (lowerQuery) {
      const matched = CATEGORIES.find(
        (cat) => cat.value && cat.label.toLowerCase().includes(lowerQuery)
      );
      if (matched && filterCategory !== matched.value) {
        setFilterCategory(matched.value);
        onChange && onChange({ date, time, filterCategory: matched.value });
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onChange && onChange({ date: e.target.value, time, filterCategory });
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    onChange && onChange({ date, time: e.target.value, filterCategory });
  };

  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    onChange && onChange({ date, time, filterCategory: e.target.value });
  };

  // Set min date to today
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="filter-date">
          Date
        </label>
        <input
          id="filter-date"
          type="date"
          className="border rounded px-3 py-2"
          value={date}
          min={todayStr}
          onChange={handleDateChange}
        />
      </div>
      {/* Time Picker */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="filter-time">
          Time
        </label>
        <select
          id="filter-time"
          className="border rounded px-3 py-2"
          value={time}
          onChange={handleTimeChange}
        >
          <option value="">Any Time</option>
          {timeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Category Picker */}
      <div>
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="filter-category"
        >
          Category
        </label>
        <select
          id="filter-category"
          className="border rounded px-3 py-2"
          value={filterCategory}
          onChange={handleFilterCategoryChange}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
