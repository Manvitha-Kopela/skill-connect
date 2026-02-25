
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, CheckCircle, Clock, Users, Play, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';

async function getCourse(id: string) {
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            instructor: true,
            modules: {
                include: {
                    lessons: true,
                },
            },
        },
    });
    return course;
}

async function getCommunityForCourse(courseId: string) {
    const community = await prisma.community.findFirst();
    return community;
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  const community = await getCommunityForCourse(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Hero Header */}
      <div className="relative aspect-[21/9] min-h-[300px] w-full rounded-2xl overflow-hidden bg-primary/10 shadow-xl">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover"
          priority
          data-ai-hint="course banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-white font-bold">{course.level}</Badge>
              <Badge variant="outline" className="text-white border-white/40 backdrop-blur-sm">
                <Globe className="h-3 w-3 mr-1.5" /> {course.language}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              {course.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage src={`https://picsum.photos/seed/${course.instructorId}/100/100`} />
                  <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-bold text-sm sm:text-base">{course.instructor.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none gap-4 sm:gap-8 px-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 font-bold text-base">Overview</TabsTrigger>
              <TabsTrigger value="curriculum" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 font-bold text-base">Curriculum</TabsTrigger>
              <TabsTrigger value="community" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 font-bold text-base">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8 space-y-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold">About this course</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold text-sm">Full Access</p>
                      <p className="text-xs text-muted-foreground">Lifetime updates included</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold text-sm">Supportive Community</p>
                      <p className="text-xs text-muted-foreground">Learn with thousands of others</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {course.modules.map((module, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border rounded-xl px-4">
                    <AccordionTrigger className="hover:no-underline font-bold text-lg">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <ul className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Play className="h-3 w-3 fill-current" />
                              </div>
                              <span className="font-medium text-sm sm:text-base">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
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

            <TabsContent value="community" className="mt-8">
            {community ? (
              <Card className="border-primary/10 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl">Associated Community</CardTitle>
                  <CardDescription>Get help and share your work with fellow learners</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
                    <Image src={community.thumbnailUrl} alt={community.name} fill className="rounded-2xl object-cover shadow-lg" data-ai-hint="team collaboration"/>
                  </div>
                  <div className="flex-grow space-y-4 text-center sm:text-left">
                    <div>
                      <h3 className="text-2xl font-extrabold">{community.name}</h3>
                      <p className="text-muted-foreground mt-1 line-clamp-2">{community.description}</p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center text-sm font-bold text-muted-foreground">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        {community.memberCount.toLocaleString()} members
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : <p className="text-center py-10 text-muted-foreground">No community associated with this course yet.</p>}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar / Enrollment */}
        <aside className="lg:col-span-4 space-y-6">
          <Card className="border-2 border-primary shadow-xl shadow-primary/10 sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-extrabold">Join this Course</CardTitle>
              <CardDescription>Enroll today and start learning immediately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <span className="font-bold">Course Price</span>
                <span className="text-2xl font-black text-primary">Free</span>
              </div>
              <div className="space-y-3">
                <Button size="lg" className="w-full font-bold h-12 text-base">Enroll Now</Button>
                {community && (
                  <Button asChild size="lg" variant="outline" className="w-full h-12 text-base font-bold">
                      <Link href={`/communities/${community.id}`}>
                      Community Hub <ArrowRight className="ml-2 h-4 w-4"/>
                      </Link>
                  </Button>
                )}
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Your Instructor</h4>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={`https://picsum.photos/seed/${course.instructorId}/100/100`} />
                    <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-extrabold text-base">{course.instructor.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Lead Domain Expert</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
