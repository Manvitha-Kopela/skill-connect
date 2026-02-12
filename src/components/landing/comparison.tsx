'use client';

import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  'Built-in Communities',
  'Gamified Learning',
  'Multi-language Support',
  'Creator Monetization',
  'Peer Skill Exchange',
];

const platforms = {
  'SkillConnect': [true, true, true, true, true],
  'Platform A': [false, true, false, true, false],
  'Platform B': [true, false, true, true, false],
};

export default function Comparison() {
  return (
    <section className="py-24 sm:py-32 bg-secondary/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose SkillConnect?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how we stack up against other learning platforms.
          </p>
        </div>
        <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 font-semibold w-2/5">Features</th>
                      {Object.keys(platforms).map(platform => (
                        <th key={platform} className="p-4 font-semibold text-center">{platform}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, featureIndex) => (
                      <tr key={feature} className="border-b">
                        <td className="p-4 font-medium">{feature}</td>
                        {Object.values(platforms).map((hasFeature, platformIndex) => (
                          <td key={platformIndex} className="p-4 text-center">
                            {hasFeature[featureIndex] ? (
                              <Check className="mx-auto h-5 w-5 text-green-500" />
                            ) : (
                              <X className="mx-auto h-5 w-5 text-destructive/70" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
