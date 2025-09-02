import React, { useState, useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(preview || null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);

            const previewURL = URL.createObjectURL(file);
            setPreviewUrl(previewURL);
            if (setPreview) {
                setPreview(previewURL);
            }
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (setPreview) {
            setPreview(null);
        }
        inputRef.current.value = ""; // Reset input
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Selected profile"
                    className="w-32 h-32 rounded-full object-cover border"
                />
            ) : (
                <div className="w-32 h-32 rounded-full bg-orange-200 flex items-center justify-center text-gray-500">
                    <LuUser size={48} />
                </div>
            )}

            <div className="flex space-x-2">
                <button
                    onClick={onChooseFile}
                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-green-600"
                >
                    <LuUpload className="mr-2" />
                    Upload
                </button>

                {previewUrl && (
                    <button
                        onClick={handleRemoveImage}
                        className="flex items-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-red-600"
                    >
                        <LuTrash className="mr-2" />
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfilePhotoSelector;
