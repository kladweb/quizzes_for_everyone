import React from 'react';
import './skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
                                                    width = "100%",
                                                    height = "100%",
                                                    borderRadius = "8px",
                                                    className = ""
                                                  }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{width, height, borderRadius}}
    ></div>
  );
};
