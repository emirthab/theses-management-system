import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Users, Building2, Search, LetterText, FileText } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    name: 'Submit Thesis',
    description: 'Submit graduate theses with comprehensive details',
    href: '/thesis/submit',
    icon: FileText,
  },
  {
    name: 'Search Theses',
    description: 'Advanced search capabilities across all thesis records',
    href: '/thesis/search',
    icon: Search,
  },
  {
    name: 'Manage People',
    description: 'Maintain records of authors and supervisors',
    href: '/people',
    icon: Users,
  },
  {
    name: 'Manage University',
    description: 'Organize universities and their associated institutes',
    href: '/university',
    icon: Building2,
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Graduate Thesis Management System</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A comprehensive platform for managing, submitting, and discovering graduate theses across institutions.
          Streamline your academic research process.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.name} href={feature.href}>
              <Card className="h-full hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-6 w-6" />
                    <span>{feature.name}</span>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}