import React from 'react';
import TechnologyCard from '@/components/layout/technologyCard';
import { FaReact, FaJs, FaCogs } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiClerk, SiZod,  SiRadixui } from 'react-icons/si';
import { MdOutlineSuperscript } from 'react-icons/md';

const technologyIcons = {
  'Next.js': <SiNextdotjs size={40} />,
  React: <FaReact size={40} />,
  'Tailwind CSS': <SiTailwindcss size={40} />,
  Clerk: <SiClerk size={40} />,
  Zod: <SiZod size={40} />,
  Zustand: <FaCogs size={40} />,
  'Lucide React': <FaJs size={40} />, // Assuming a generic JS logo here; you can pick a different one
  'Radix UI': <SiRadixui size={40} />,
  TypeScript: <MdOutlineSuperscript size={40} />,
};
const technologies = [
  {
    name: 'Next.js',
    description: 'The backbone of our app! Makes building web apps super fast and efficient.',
    link: 'https://nextjs.org/',
  },
  {
    name: 'React',
    description: 'Powers the user interface, making it interactive and dynamic.',
    link: 'https://react.dev/',
  },
  {
    name: 'Tailwind CSS',
    description: 'Helps us style the app quickly with utility classes, making it look great!',
    link: 'https://tailwindcss.com/',
  },
  {
    name: 'Clerk',
    description: 'Handles user authentication, so you can securely sign in and out.',
    link: 'https://clerk.com/',
  },
  {
    name: 'Zod',
    description: 'Ensures data is correct and safe, like a digital bouncer for our app.',
    link: 'https://zod.dev/',
  },
  {
    name: 'Zustand',
    description: 'Manages the app’s state, making sure everything stays in sync.',
    link: 'https://zustand-demo.pmnd.rs/',
  },
  {
    name: 'Lucide React',
    description: 'Provides beautiful icons that enhance the user experience.',
    link: 'https://lucide.dev/',
  },
  {
    name: 'Radix UI',
    description: 'Helps create accessible and customizable UI components.',
    link: 'https://www.radix-ui.com/',
  },
//   {
//     name: 'React Hook Form',
//     description: 'Makes form handling easy and efficient.',
//     link: 'https://react-hook-form.com/',
//   },

  {
    name: 'TypeScript',
    description: 'Adds safety and clarity to our code, preventing errors.',
    link: 'https://www.typescriptlang.org/',
  },
];

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center mx-auto">Technologies We Used in this App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((tech) => (
          <TechnologyCard
            key={tech.name}
            name={tech.name}
            description={tech.description}
            link={tech.link}
            icon={technologyIcons[tech.name as keyof typeof technologyIcons]}
          />
        ))}
      </div>
    </div>
  );
}