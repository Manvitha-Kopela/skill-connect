import Image from 'next/image';
import { notFound } from 'next/navigation';
import { courses, communities } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id);
  const community = communities[0]; // Mock community

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative h-64 w-full rounded-lg overflow-hidden bg-primary/10">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover"
          data-ai-hint="course banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-primary-foreground">{course.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{course.level}</Badge>
            <Badge variant="outline" className="text-primary-foreground border-primary-foreground/50">{course.language}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum">
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{module.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pl-4">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{lesson.duration}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="community">
              <Card>
                <CardHeader>
                  <CardTitle>Community Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image src={community.thumbnailUrl} alt={community.name} fill className="rounded-lg object-cover" data-ai-hint="team collaboration"/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{community.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{community.description}</p>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {community.memberCount.toLocaleString()} members
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={course.instructor.avatarUrl} />
                <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{course.instructor.name}</h3>
                <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
              </div>
            </CardContent>
          </Card>
          <Button size="lg" className="w-full">Join Course</Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href={`/communities/${community.id}`}>
              Go to Community <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
