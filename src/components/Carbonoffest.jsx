import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { images } from '../assets/images';

const Carbonoffest = () => {
    // Only images for the slider
    const slides = [
        images.GeotreePoster,
        images.GeotreePoster2,
        images.GeotreePoster3
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));

    useEffect(() => {
        const timer = setInterval(nextSlide, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="relative w-full max-w-6xl h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-white shadow-xl border border-white/50 backdrop-blur-sm group">
                <img
                    src={slides[currentSlide]}
                    alt={`Slide ${currentSlide + 1}`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    style={{ display: 'block' }}
                />

                {/* Overlay gradient for text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                    <FaChevronLeft size={20} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                    <FaChevronRight size={20} />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${currentSlide === index
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Carbonoffest;
