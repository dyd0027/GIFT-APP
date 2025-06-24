interface ButtonProps {
  onClick: () => void;
  label: string;
  className?: string | '';
}

const Button = ({ onClick, label, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded bg-[#2FCBC0] px-4 py-2 text-white hover:bg-[#00B0AD] ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
