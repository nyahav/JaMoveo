import React from 'react';

interface TechnologyCardProps {
  name: string;
  description: string;
  link?: string;
  icon: React.ReactNode;
}

export default function TechnologyCard({ name, description, link, icon }: TechnologyCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-center mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600 my-2">{description}</p>
      <a 
        href={link} 
        className="text-blue-500 hover:text-blue-700 mt-2 block transition-colors"
        target="_blank" 
        rel="noopener noreferrer"
      >
        Learn more
      </a>
    </div>
  );
}