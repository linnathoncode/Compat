"use client";

type Props = {
  onClick?: () => void;
  label?: string;
};

export default function AuthButton({ onClick, label = "Sign in" }: Props) {
  return (
    <button
      className="rounded border-2 bg-white px-4 py-2 text-base font-medium text-[#1e152c] transition-colors hover:border-white hover:bg-[#1e152c] hover:text-white"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
