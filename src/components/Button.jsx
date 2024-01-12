import React from "react";

const Button = ({ children, type, ...props }) => {
  return (
    <>
      <div className="btn">
        <button
          type={type}
          className="w-[7rem] h-[2.5rem] bg-rose-400 text-white font-semibold rounded-md"
          {...props}
        >
          {children}
        </button>
      </div>
    </>
  );
};

export default Button;
