import PropTypes from "prop-types";

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "",
  error = ""
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-ochre-300 font-texte-corps text-sm md:text-base mb-2"
        >
          {label} {required && <span className="text-blood-700">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-2
          bg-city-800
          border-2 border-ochre-600
          rounded
          text-city-50 font-texte-corps
          placeholder-city-400
          focus:outline-none focus:border-blood-700 focus:ring-2 focus:ring-blood-700/50
          transition-colors duration-200
          ${error ? 'border-blood-700' : ''}
        `}
      />
      {error && (
        <p className="text-blood-700 text-sm font-texte-corps mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default InputField;
