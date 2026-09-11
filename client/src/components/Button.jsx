import "./Button.css";

function Button({ children, type = "button", onClick, variant = "primary" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`common-button ${variant}`}
    >
      {children}
    </button>
  );
}

export default Button;