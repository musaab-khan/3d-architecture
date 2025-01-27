// 'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const AssetsDisplay = ({ assets, selectedAssets, addAsset }) => {
    const [loadingImages, setLoadingImages] = useState({});
    const [isVisible, setIsVisible] = useState(true); // Local state for visibility

    // Filter assets by subcategory
    const filteredAssets = assets.filter((asset) => asset.subcategory === selectedAssets);

    // Initialize loading state for images only once when filteredAssets changes
    useEffect(() => {
        const initialLoadingState = {};
        filteredAssets.forEach((_, index) => {
            initialLoadingState[index] = true; // Set all images to "loading" initially
        });
        setLoadingImages(initialLoadingState);
    }, [assets, selectedAssets]);

    // Handle image load event
    const handleImageLoad = (index) => {
        setLoadingImages((prev) => ({ ...prev, [index]: false }));
    };

    // If `selectedAssets` changes, reset visibility
    useEffect(() => {
        setIsVisible(true);
    }, [selectedAssets]);

    if (!isVisible || !selectedAssets) {
        return null; // Don't render if not visible or if `selectedAssets` is null
    }

    return (
        <div className=" border-2 border-black absolute pb-3 h-[80%] top-0 right-[0] rounded-xl">
            <h2 className="py-2 text-xl font-semibold mb-4 uppercase text-center underline underline-offset-4 bg-black relative">
                {selectedAssets}
                <span
                    className="cursor-pointer text-sm absolute right-2 top-0 font-thin"
                    onClick={() => setIsVisible(false)} // Hide the component
                >
                    &#10006;
                </span>
            </h2>
            <div className="grid grid-cols-3 gap-4 p-2 h-[85%] scrollbar-thin overflow-auto">
                {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset, index) => (
                        <div
                            key={index}
                            className="border p-2 rounded-lg relative w-[100px] h-[100px] bg-[#00000030]"
                        >
                            {loadingImages[index] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                                </div>
                            )}
                            <Image
                                src={asset.imageURL}
                                alt={asset.modelName}
                                fill
                                className={`object-cover rounded-lg active:bg-[#ffffff30] ${
                                    loadingImages[index] ? 'invisible' : 'visible'
                                }`}
                                onLoad={() => handleImageLoad(index)}
                                onClick={() => addAsset(asset.modelURL)}
                            />
                        </div>
                    ))
                ) : (
                    <p className="col-span-3 text-center text-gray-500">
                        No assets available for the selected subcategory.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AssetsDisplay;
