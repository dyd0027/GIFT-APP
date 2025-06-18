interface AsyncButtonProps {
  handleSubmit: () => Promise<void>;
  label: string;
}

const AsyncButton = ({ handleSubmit, label }: AsyncButtonProps) => {
  return (
    <button
      onClick={handleSubmit}
      className="rounded bg-[#2FCBC0] px-4 py-2 text-white hover:bg-[#00B0AD]"
    >
      {label}
    </button>
  );
};

export default AsyncButton;
