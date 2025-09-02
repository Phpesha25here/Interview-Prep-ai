import React from "react";

const DeleteAlertContent = ({ content, onDelete, onCancel }) => {
  return (
    <div className="p-5">
      {/* Message */}
      <p className="text-[14px]">{content}</p>

      {/* Buttons */}
      <div className="flex justify-end mt-6 gap-3">
        {/* Cancel button */}
        <button
          type="button"
          className="btn-small bg-gray-300 text-gray-700 hover:bg-gray-300"
          onClick={onCancel}
        >
          Cancel
        </button>

        {/* Delete button */}
        <button
          type="button"
          className="btn-small bg-amber-600 text-white hover:bg-red-700"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
