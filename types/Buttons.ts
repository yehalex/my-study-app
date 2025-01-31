export type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "icon";
  className?: string;
};
