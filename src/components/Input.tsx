import React from "react";

const Input = ({
  type,
  placeholder,
  changeHandler,
}: {
  type: string;
  placeholder: string;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      className=" w-full p-2 border-2 rounded-md border-black"
      type={type}
      placeholder={placeholder}
      onChange={changeHandler}
    />
  );
};

export default Input;
