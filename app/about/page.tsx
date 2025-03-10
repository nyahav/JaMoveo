import React from 'react';
import TechnologyCard from '@/components/layout/technologyCard';

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
          <TechnologyCard key={tech.name} {...tech} />
        ))}
      </div>
    </div>
  );
}