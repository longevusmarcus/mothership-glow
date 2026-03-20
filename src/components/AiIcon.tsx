/**
 * Premium AI icon — replaces cheap Sparkles across the app.
 * A minimal, geometric "neural" mark that scales well at 12–20px.
 */
const AiIcon = ({ className = "", size = 14 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Four-point star / diamond burst — clean, geometric AI mark */}
    <path
      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M12 6L13.2 10.8L18 12L13.2 13.2L12 18L10.8 13.2L6 12L10.8 10.8L12 6Z"
      fill="currentColor"
      opacity="0.4"
    />
  </svg>
);

export default AiIcon;
