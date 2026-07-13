// marca X (substitui a logo original)
export default function DixiLogoMark({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo DIXI Soluções"
    >
      <path
        d="M4 4 L18 24 L4 44 L14 44 L24 30 L34 44 L44 44 L30 24 L44 4 L34 4 L24 18 L14 4 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
