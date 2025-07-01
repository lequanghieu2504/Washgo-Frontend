import React, { useState, useEffect } from "react";
import FilterBox from "../common/FilterBox";

export function Test() {
  return (
    <div>
      <FilterBox
        onResults={(result) => {
          console.log(result);
        }}
      />
    </div>
  );
}
