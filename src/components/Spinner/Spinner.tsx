type SpinnerProps = { label?: string };

export default function Spinner({ label = 'Loading...' }: SpinnerProps): JSX.Element {
  return (
    <div
      data-testid="spinner"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      aria-live="polite"
      aria-busy="true"
    >
      <svg width="40" height="40" viewBox="0 0 50 50" role="img" aria-label={label}>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
