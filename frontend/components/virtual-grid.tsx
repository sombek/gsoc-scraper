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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rowCount = Math.ceil(items.length / columnCount);
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 250,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-auto"
      style={{ position: "relative" }}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            // transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const rowStartIndex =
              virtualRow.index * (isMobile ? 1 : columnCount);
            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  display: "grid",
                  gridTemplateColumns: `repeat(${
                    isMobile ? 1 : columnCount
                  }, 1fr)`,
                  gap: gap,
                  paddingBottom: gap,
                }}
              >
                {Array.from({ length: isMobile ? 1 : columnCount }).map(
                  (_, columnIndex) => {
                    const itemIndex = rowStartIndex + columnIndex;
                    if (itemIndex >= items.length) return null;
                    return (
                      <div key={columnIndex} style={{ width: "100%" }}>
                        {renderItem(items[itemIndex], itemIndex)}
                      </div>
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
