const Button = ({
  buttonLabel,
  clickHandler,
  classes,
  disabled,
}: {
  buttonLabel: string;
  clickHandler: () => void;
  classes: string;
  disabled: boolean;
}) => {
  return (
    <button disabled={disabled} className={`${classes}`} onClick={clickHandler}>
      {buttonLabel}
    </button>
  );
};

export default Button;
