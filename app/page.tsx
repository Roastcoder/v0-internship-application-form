import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, HomeIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
          <div className="relative w-64 h-20 md:w-80 md:h-24 mb-4">
            <Image
              src="/finonest-logo.png"
              alt="Finonest - Trust Comes First"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">Join Finonest</h1>
            <p className="text-base md:text-lg text-muted-foreground text-pretty">
              Choose the opportunity that best fits your career goals. We're looking for passionate individuals ready to
              learn and grow.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>IT Internship</CardTitle>
              </div>
              <CardDescription>
                Gain hands-on experience with real-world projects and learn from industry experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>• Flexible duration options</li>
                <li>• Multiple technology domains</li>
                <li>• Mentorship and guidance</li>
                <li>• Certificate upon completion</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/internship">Apply for Internship</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <HomeIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Work from Home</CardTitle>
              </div>
              <CardDescription>Join our freelance team and work on projects remotely at your own pace</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>• Flexible working hours</li>
                <li>• Remote opportunity</li>
                <li>• Project-based work</li>
                <li>• Competitive compensation</li>
              </ul>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/work-from-home">Apply for WFH</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
