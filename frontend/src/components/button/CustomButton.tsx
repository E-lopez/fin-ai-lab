const CustomButton = ({ label, method, cssModifier = 'default', type = 'button' }: {label?: string, method: () => any, cssModifier?: string, type: "button" | "submit" | "reset" | undefined}) => {
  const inheritedFunction = () => {
    if(!method) return;
    return method()
  }
  return(
    <div className={`base-button base-button--${cssModifier}`}>
      <button
        className="base-button__button"
        onClick={() => inheritedFunction()}
        type={type}
      >
        { label ?? 'Button' }
      </button>
    </div>
  )
}

export default CustomButton;
