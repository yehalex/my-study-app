import React from "react";
import { ButtonProps } from "@/types/Buttons";

const Button = ({
  onClick,
  disabled,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded transition-colors duration-200";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400",
    icon: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
