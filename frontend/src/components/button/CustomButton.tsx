const CustomButton = ({ label, method, cssModifier = 'default' }: {label?: string, method: () => any, cssModifier?: string}) => {
  const inheritedFunction = () => {
    if(!method) return;
    return method()
  }
  return(
    <div className={`base-button base-button--${cssModifier}`}>
      <button
        className="base-button__button"
        onClick={() => inheritedFunction()}
      >
        { label ?? 'Button' }
      </button>
    </div>
  )
}

export default CustomButton;
