interface AsyncButtonProps {
  handleSubmit: () => Promise<void>;
  label: string;
  className?: string | '';
}

const AsyncButton = ({ handleSubmit, label, className }: AsyncButtonProps) => {
  return (
    <button
      onClick={handleSubmit}
      className={`rounded bg-[#2FCBC0] px-4 py-2 text-white hover:bg-[#00B0AD] ${className}`}
    >
      {label}
    </button>
  );
};

export default AsyncButton;
