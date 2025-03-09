import React from 'react';

interface TechnologyCardProps {
  name: string;
  description: string;
  link?: string;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ name, description, link }) => {
  return (
    <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Learn More
        </a>
      )}
    </div>
  );
};

export default TechnologyCard;