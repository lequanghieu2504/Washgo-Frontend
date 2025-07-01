  // // src/components/ProductSchedule.jsx
  // import React, { useState, useEffect, useMemo } from "react";
  // import PropTypes from "prop-types";

  // const ProductSchedule = ({ onSlotClick }) => {
  //   const [weekOffset, setWeekOffset] = useState(0);
  //   const [selectedSlot, setSelectedSlot] = useState(null);
  //   const [currentTime, setCurrentTime] = useState(new Date());

  //   // Update currentTime every second
  //   useEffect(() => {
  //     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  //     return () => clearInterval(timer);
  //   }, []);

  //   // Calculate start of the week (Sunday)
  //   const weekStart = useMemo(() => {
  //     const ref = new Date(currentTime);
  //     ref.setDate(ref.getDate() + weekOffset * 7);
  //     ref.setDate(ref.getDate() - ref.getDay());
  //     ref.setHours(0, 0, 0, 0);
  //     return ref;
  //   }, [currentTime, weekOffset]);

  //   // Generate array of 7 days
  //   const weekDays = useMemo(
  //     () =>
  //       Array.from({ length: 7 }, (_, i) => {
  //         const d = new Date(weekStart);
  //         d.setDate(weekStart.getDate() + i);
  //         return d;
  //       }),
  //     [weekStart]
  //   );

  //   // Fixed time slots
  //   const timeSlots = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  //   const isToday = (d) => d.toDateString() === currentTime.toDateString();

  //   return (
  //     <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
  //       {/* Week navigation */}
  //       <div className="flex justify-between items-center mb-4">
  //         <button
  //           onClick={() => setWeekOffset((w) => w - 1)}
  //           className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
  //         >
  //           « Previous Week
  //         </button>
  //         <button
  //           onClick={() => setWeekOffset((w) => w + 1)}
  //           className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
  //         >
  //           Next Week »
  //         </button>
  //       </div>

  //       <div className="overflow-x-auto">
  //         <div className="grid grid-cols-7 gap-3 min-w-[500px]">
  //           {weekDays.map((date) => {
  //             const today = isToday(date);
  //             return (
  //               <div
  //                 key={date.toDateString()}
  //                 className={`border border-gray-200 rounded-md p-2 ${
  //                   today ? "bg-red-50" : "bg-white"
  //                 }`}
  //               >
  //                 {/* Day header */}
  //                 <div className="text-center mb-2 pb-1 border-b border-gray-100">
  //                   <div
  //                     className={`font-semibold text-sm ${
  //                       today ? "text-[#cc0000]" : "text-gray-700"
  //                     }`}
  //                   >
  //                     {date.toLocaleDateString(undefined, {
  //                       weekday: "short",
  //                     })}
  //                   </div>
  //                   <div
  //                     className={`text-xs ${
  //                       today ? "text-red-500" : "text-gray-500"
  //                     }`}
  //                   >
  //                     {date.getDate()}
  //                   </div>
  //                 </div>

  //                 {/* Time slots */}
  //                 <div className="flex flex-col gap-1.5">
  //                   {timeSlots.map((hour) => {
  //                     const slotTime = new Date(date);
  //                     slotTime.setHours(hour, 0, 0, 0);

  //                     const isPast = slotTime < currentTime;
  //                     const isSelected =
  //                       selectedSlot?.getTime() === slotTime.getTime();

  //                     const baseClass =
  //                       "text-xs text-center py-1.5 px-1 rounded-md transition duration-150 ease-in-out w-full focus:outline-none focus:ring-2 focus:ring-offset-1";

  //                     let stateClass;
  //                     if (isPast) {
  //                       stateClass =
  //                         "bg-gray-100 text-gray-400 cursor-not-allowed opacity-75";
  //                     } else if (isSelected) {
  //                       stateClass =
  //                         "bg-[#cc0000] text-white font-semibold shadow-md cursor-pointer focus:ring-[#cc0000]";
  //                     } else {
  //                       stateClass =
  //                         "bg-gray-50 text-gray-700 border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 focus:ring-gray-400";
  //                     }

  //                     return (
  //                       <button
  //                         key={hour}
  //                         disabled={isPast}
  //                         onClick={() => {
  //                           if (isPast) return;
  //                           const newSel = isSelected ? null : slotTime;
  //                           setSelectedSlot(newSel);
  //                           if (newSel) {
  //                             onSlotClick?.({
  //                               ...{
  //                                 id: null,
  //                                 isActive: true,
  //                                 capacity: 1,
  //                               },
  //                               availableFrom: slotTime,
  //                               availableTo: new Date(
  //                                 slotTime.getTime() + 60 * 60 * 1000
  //                               ),
  //                             });
  //                           } else {
  //                             onSlotClick?.(null);
  //                           }
  //                         }}
  //                         className={`${baseClass} ${stateClass}`}
  //                       >
  //                         {slotTime.toLocaleTimeString(undefined, {
  //                           hour: "numeric",
  //                           minute: "2-digit",
  //                           hour12: true,
  //                         })}
  //                       </button>
  //                     );
  //                   })}
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // ProductSchedule.propTypes = {
  //   onSlotClick: PropTypes.func,
  // };

  // export default ProductSchedule;





  import React, { useState, useEffect, useMemo } from "react";
  import PropTypes from "prop-types";
  
  const ProductSchedule = ({ schedules, onSlotClick }) => {
    const [weekOffset, setWeekOffset] = useState(0);
    const [selected, setSelected] = useState(null);
    const [now, setNow] = useState(new Date());
  
    // Cập nhật now mỗi giây để disable slot đã qua
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
  
    // Chuẩn hoá schedules ngay khi props thay đổi
    const normalizedSchedules = useMemo(
      () =>
        schedules.map((s) => ({
          ...s,
          availableFrom: new Date(s.availableFrom),
          availableTo: new Date(s.availableTo),
          // backend có thể dùng "active" hoặc "isActive"
          isActive: typeof s.isActive === "boolean"
            ? s.isActive
            : typeof s.active === "boolean"
            ? s.active
            : true,
          capacity: typeof s.capacity === "number" ? s.capacity : 1,
        })),
      [schedules]
    );
  
    // Tính ngày bắt đầu tuần (Chủ nhật) và danh sách 7 ngày
    const weekStart = useMemo(() => {
      const d = new Date(now);
      d.setDate(d.getDate() + weekOffset * 7);
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      return d;
    }, [now, weekOffset]);
  
    const weekDays = useMemo(
      () =>
        Array.from({ length: 7 }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          return d;
        }),
      [weekStart]
    );
  
    const isToday = (d) => d.toDateString() === now.toDateString();
  
    return (
      <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        {/* Navigation tuần */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            « Previous Week
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Next Week »
          </button>
        </div>
  
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[500px]">
            {weekDays.map((date) => {
              const today = isToday(date);
  
              // Lọc và sắp xếp slot của ngày này
              const daySchedules = normalizedSchedules
                .filter(
                  (sch) =>
                    sch.availableFrom.toDateString() === date.toDateString()
                )
                .sort((a, b) => a.availableFrom - b.availableFrom);
  
              return (
                <div
                  key={date.toDateString()}
                  className={`border border-gray-200 rounded-md p-2 ${
                    today ? "bg-red-50" : "bg-white"
                  }`}
                >
                  {/* Tiêu đề ngày */}
                  <div className="text-center mb-2 pb-1 border-b border-gray-100">
                    <div
                      className={`font-semibold text-sm ${
                        today ? "text-[#cc0000]" : "text-gray-700"
                      }`}
                    >
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                    <div
                      className={`text-xs ${
                        today ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>
  
                  {/* Các slot */}
                  <div className="flex flex-col gap-1.5">
                    {daySchedules.length > 0 ? (
                      daySchedules.map((sch) => {
                        const isPast = sch.availableFrom.getTime() < now.getTime();
                        const isDisabled =
                          isPast || sch.capacity <= 0 || !sch.isActive;
                        const isSelected =
                          selected?.availableFrom.getTime() ===
                          sch.availableFrom.getTime();
  
                        // Tùy class theo state
                        let stateClass = "";
                        if (isDisabled) {
                          stateClass =
                            "bg-gray-100 text-gray-400 cursor-not-allowed opacity-75";
                        } else if (isSelected) {
                          stateClass =
                            "bg-[#cc0000] text-white font-semibold shadow-md cursor-pointer";
                        } else {
                          stateClass =
                            "bg-gray-50 text-gray-700 border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300";
                        }
  
                        return (
                          <button
                            key={sch.availableFrom.toISOString()}
                            disabled={isDisabled}
                            onClick={() => {
                              if (isDisabled) return;
                              const pick = isSelected ? null : sch;
                              setSelected(pick);
                              onSlotClick?.(pick);
                            }}
                            className={`text-xs text-center py-1.5 px-1 rounded-md transition duration-150 ease-in-out w-full focus:outline-none focus:ring-2 focus:ring-offset-1 ${stateClass}`}
                          >
                            {sch.availableFrom.toLocaleTimeString(undefined, {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            –{" "}
                            {sch.availableTo.toLocaleTimeString(undefined, {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-400 text-xs">
                        No slots
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  ProductSchedule.propTypes = {
    schedules: PropTypes.array.isRequired,
    onSlotClick: PropTypes.func,
  };
  
  export default ProductSchedule;
  