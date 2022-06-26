import React, { useState, useEffect } from "react";

const RadioButton = ({ prices, handleFilters }) => {
  const [value, setValue] = useState([]);
  const handleChange = (event) => {
    handleFilters(event.target.value);
    setValue(event.target.value);
  };

  return prices.map((p, i) => (
    <div key={i}>
      <input
        onChange={handleChange}
        value={`${p._id}`}
        name={p} //so you can only select 1 option at 1 time
        type="radio"
        className="mr-2 ml-4"
      />
      <label className="form-check-label">{p.name}</label>
    </div>
  ));
};

export default RadioButton;
