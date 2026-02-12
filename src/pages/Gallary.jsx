import React, { useState } from 'react';
import { images } from '../assets/images';
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTranslation } from 'react-i18next';

const Gallary = () => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const galleryImages = [
        { src: images.A, alt: t('gallery.images.plantation1'), id: 'plantation1' },
        { src: images.B, alt: t('gallery.images.plantation2'), id: 'plantation2' },
        { src: images.C, alt: t('gallery.images.plantation3'), id: 'plantation3' },
        { src: images.D, alt: t('gallery.images.plantation4'), id: 'plantation4' },
        { src: images.E, alt: t('gallery.images.plantation5'), id: 'plantation5' }
    ];

    const handleImageClick = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
        setSelectedImage(galleryImages[(currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1)]);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
        setSelectedImage(galleryImages[(currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1)]);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2E7D32] mb-6 text-center">
                {t('gallery.title')}
            </h2>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {galleryImages.map((image, index) => (
                    <div 
                        key={image.id} 
                        className="rounded-lg shadow-md overflow-hidden aspect-square cursor-pointer transform transition-transform duration-300 hover:scale-105"
                        onClick={() => handleImageClick(image, index)}
                    >
                        <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Modal for Expanded Image View */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg">
                        {/* Close Button */}
                        <button 
                            onClick={handleClose}
                            className="absolute -top-2 -right-2 z-50 bg-white rounded-full p-1 shadow-lg text-gray-800 hover:text-gray-600 transition-colors"
                            aria-label={t('gallery.actions.close')}
                        >
                            <IoClose size={32} />
                        </button>

                        {/* Navigation Buttons */}
                        <button 
                            onClick={handlePrevious}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                            aria-label={t('gallery.actions.previous')}
                        >
                            <IoIosArrowBack size={28} />
                        </button>

                        <button 
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                            aria-label={t('gallery.actions.next')}
                        >
                            <IoIosArrowForward size={28} />
                        </button>

                        {/* Expanded Image Container */}
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img 
                                src={selectedImage.src} 
                                alt={selectedImage.alt}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Gallary;