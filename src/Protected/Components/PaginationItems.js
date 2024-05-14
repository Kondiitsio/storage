import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';

export default function PaginationItems({ currentPage, itemsPerPage, totalItems, paginate }) {
    const [hovering, setHovering] = useState(false);
    const pageNumbers = [];
    
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
      }

    const handlePreviousClick = (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNextClick = (event) => {
        event.preventDefault();
        if (currentPage < pageNumbers.length) {
            paginate(currentPage + 1);
        }
    };

    return (
        <nav className="flex items-center justify-between px-4 border-t border-gray-300 sm:px-0">
            
            <div 
                className="flex flex-1 w-0 -mt-px hover:text-indigo-600" 
                onMouseEnter={() => setHovering(true)} 
                onMouseLeave={() => setHovering(false)}
                >
                <a
                    onClick={handlePreviousClick}
                    className={`inline-flex items-center pt-4 pr-1 text-sm font-medium border-t-2 border-transparent cursor-pointer ${hovering ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                    <ArrowLongLeftIcon className={`w-5 h-5 mr-3 ${hovering ? 'text-indigo-600' : 'text-gray-400'}`} aria-hidden="true" />
                    Previous
                </a>
            </div>
           
            {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
            <div className="hidden md:-mt-px md:flex">
            {pageNumbers.map(number => (
                <div key={number}>
                <a
                    onClick={() => paginate(number)}
                    className={`inline-flex items-center px-4 pt-4 text-sm font-medium border-t-2 cursor-pointer ${
                    number === currentPage ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {number}
                </a>
                </div>
            ))}
            </div>
            <div 
                className="flex justify-end flex-1 w-0 -mt-px hover:text-indigo-600" 
                onMouseEnter={() => setHovering(true)} 
                onMouseLeave={() => setHovering(false)}
                >
                <a
                    onClick={handleNextClick}
                    className={`inline-flex items-center pt-4 pl-1 text-sm font-medium border-t-2 border-transparent cursor-pointer ${hovering ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                    Next
                    <ArrowLongRightIcon className={`w-5 h-5 ml-3 ${hovering ? 'text-indigo-600' : 'text-gray-400'}`} aria-hidden="true" />
                </a>
            </div>
        </nav>
    );
}