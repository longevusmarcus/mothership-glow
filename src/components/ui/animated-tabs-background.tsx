"use client";

import { useState, useRef, useId, ReactElement, Children } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CleanMotionBgProps = {
  children: ReactElement<{ "data-key": string }> | ReactElement<{ "data-key": string }>[];
  onChange?: (activeKey: string | null) => void;
  className?: string;
  hoverable?: boolean;
  defaultKey?: string | null;
};

export const CleanMotionBackground = ({
  children,
  onChange,
  className,
  hoverable = true,
  defaultKey = null,
}: CleanMotionBgProps) => {
  const [activeKey, setActiveKey] = useState(defaultKey);
  const id = useId();
  const stableId = useRef(id);
  const bgLayoutId = `clean-bg-${stableId.current}`;

  const updateActive = (key: string | null) => {
    setActiveKey(key);
    onChange?.(key);
  };

  if (hoverable) {
    return (
      <div
        className={cn("flex items-center gap-1", className)}
        onMouseLeave={() => updateActive(null)}
      >
        {Children.map(children, (child: ReactElement, idx) => {
          const keyAttr = child.props["data-key"];
          const isActive = activeKey === keyAttr;

          return (
            <div
              key={keyAttr ?? idx}
              className="relative cursor-pointer px-3 py-1.5 rounded-lg flex-1 text-center"
              onMouseEnter={() => updateActive(keyAttr)}
            >
              {isActive && (
                <motion.div
                  layoutId={bgLayoutId}
                  className="absolute inset-0 rounded-lg bg-[var(--primary-hover)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">
                {child.props.children}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Children.map(children, (child: ReactElement, idx) => {
        const keyAttr = child.props["data-key"];
        const isActive = activeKey === keyAttr;

        return (
          <div
            key={keyAttr ?? idx}
            className="relative cursor-pointer px-3 py-1.5 rounded-lg flex-1 text-center"
            onClick={() => updateActive(keyAttr)}
          >
            {isActive && (
              <motion.div
                layoutId={bgLayoutId}
                className="absolute inset-0 rounded-lg bg-[var(--primary-hover)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">
              {child.props.children}
            </span>
          </div>
        );
      })}
    </div>
  );
};
