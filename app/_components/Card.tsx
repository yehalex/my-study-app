"use client";

import React, { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface FlipCardProps {
  children: ReactNode | [ReactNode, ReactNode];
  isFlippable?: boolean;
  initialFlipped?: boolean;
  hasRoute?: boolean;
  href?: string;
}

const Card: React.FC<FlipCardProps> = ({
  children,
  isFlippable = false,
  initialFlipped = false,
  hasRoute = false,
  href = "",
}) => {
  const [flipped, setFlipped] = useState(initialFlipped);

  const childrenArray = React.Children.toArray(children);
  const frontContent = childrenArray[0];
  const backContent = isFlippable ? childrenArray[1] : null;

  const router = useRouter();

  const handleClick = (e: any) => {
    if (isFlippable) {
      setFlipped(!flipped);
    } else if (hasRoute) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <div
      className="relative min-w-[350px] w-full xl:max-w-[400px] h-40 [perspective:1000px] cursor-pointer "
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className={`w-full h-full ${flipped ? "invisible" : "visible"}`}>
            {frontContent}
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] backface-hidden">
          <div className={`w-full h-full ${flipped ? "visible" : "invisible"}`}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
