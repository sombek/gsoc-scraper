"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columnCount?: number;
  gap?: number;
  overscan?: number;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  columnCount = 2,
  gap = 16,
  overscan = 5,
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState(300);

  // Calculate the number of rows based on the number of items and columns
  const rowCount = Math.ceil(items.length / columnCount);

  // Update column width on resize
  useEffect(() => {
    if (!parentRef.current) return;

    const updateColumnWidth = () => {
      if (!parentRef.current) return;

      const parentWidth = parentRef.current.offsetWidth;
      const totalGapWidth = gap * (columnCount - 1);
      const newColumnWidth = (parentWidth - totalGapWidth) / columnCount;

      setColumnWidth(newColumnWidth);
    };

    updateColumnWidth();

    const resizeObserver = new ResizeObserver(updateColumnWidth);
    resizeObserver.observe(parentRef.current);

    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, [columnCount, gap]);

  // Calculate the height of each row (assuming all items have the same height)
  const rowHeight = 250 + gap; // Adjust this based on your card height

  // Create the virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-auto"
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowStartIndex = virtualRow.index * columnCount;

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${rowHeight - gap}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: "grid",
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                gap: `${gap}px`,
              }}
            >
              {Array.from({ length: columnCount }).map((_, columnIndex) => {
                const itemIndex = rowStartIndex + columnIndex;
                if (itemIndex >= items.length) return null;

                return (
                  <div key={columnIndex} className="h-full">
                    {renderItem(items[itemIndex], itemIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
