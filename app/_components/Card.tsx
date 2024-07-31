"use client";

import React, { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface CardProps {
  children: ReactNode | [ReactNode, ReactNode];
  isFlippable?: boolean;
  initialFlipped?: boolean;
  hasRoute?: boolean;
  href?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  isFlippable = false,
  initialFlipped = false,
  hasRoute = false,
  href = "",
}) => {
  const [flipped, setFlipped] = useState(initialFlipped);
  const router = useRouter();

  const childrenArray = React.Children.toArray(children);
  const frontContent = childrenArray[0];
  const backContent = isFlippable ? childrenArray[1] : null;

  const handleClick = (e: React.MouseEvent) => {
    if (isFlippable) {
      setFlipped(!flipped);
    } else if (hasRoute) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <div
      className="relative w-full h-40 perspective-1000 cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>
        {isFlippable && (
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            {backContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
