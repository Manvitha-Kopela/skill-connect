import { Mountain } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Product',
    links: ['Courses', 'Communities', 'Pricing', 'Features'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Blog'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
  },
];

const socialLinks = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">SkillConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Skill exchange + community-driven learning.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className="md:justify-self-center">
              <h3 className="font-semibold tracking-wider text-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkillConnect, Inc. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">{social}</span>
                  {/* Placeholder for actual icons */}
                  <div className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
