"use client";

import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import "./styles.css";

interface TimelineProps {
  initialChunk: React.ReactNode[];
  initialCursor?: string;
  loadMoreAction: (cursor?: string) => Promise<{
    cursor?: string;
    chunk: React.ReactNode[];
  }>;
}

export function Timeline({
  initialChunk,
  loadMoreAction,
  initialCursor,
}: TimelineProps) {
  const [items, setItems] = useState(initialChunk);
  const itemsLength = items.length;
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const hasNextPage = !!cursor;
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? itemsLength + 1 : itemsLength,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const lastItemIndex = [...rowVirtualizer.getVirtualItems()].reverse()[0]
    .index;

  useEffect(() => {
    if (!lastItemIndex) {
      return;
    }

    console.log({
      "lastItem.index": lastItemIndex,
      "items.length": items.length,
      hasNextPage: hasNextPage,
      isLoading: isLoading,
    });
    if (lastItemIndex >= items.length - 1 && hasNextPage && !isLoading) {
      setIsLoading(true);
      loadMoreAction(cursor)
        .then(({ cursor, chunk }) => {
          console.log("SET STATE");
          setCursor(cursor);
          setItems((items) => [...items, ...chunk]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    cursor,
    hasNextPage,
    isLoading,
    items.length,
    loadMoreAction,
    lastItemIndex,
  ]);

  return (
    <div
      ref={parentRef}
      className="List"
      style={{
        height: `500px`,
        width: `100%`,
        overflow: "auto",
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
          const isLoaderRow = virtualRow.index > itemsLength - 1;
          const item = items[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  "Loading more..."
                ) : (
                  "Nothing more to load"
                )
              ) : (
                <div>{item}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
