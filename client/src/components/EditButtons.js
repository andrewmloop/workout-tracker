import React from "react";

export default function EditButtons({editFunction, editMode, addFunction}) {
  const editText = editMode ? "Done" : "Edit";

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      <button onClick={editFunction} className="w-full btn">{editText}</button>
      <button onClick={addFunction}  className="w-full btn-confirm">Add</button>
    </div>
  );
}