interface ButtonProps {
  onClick: () => void;
  label: string;
}

const Button = ({ onClick, label }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="rounded bg-[#2FCBC0] px-4 py-2 text-white hover:bg-[#00B0AD]"
    >
      {label}
    </button>
  );
};

export default Button;
