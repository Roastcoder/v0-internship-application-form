import WorkFromHomeForm from "@/components/work-from-home-form"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function WorkFromHomePage() {
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
              Work from Home Application
            </h1>
            <p className="text-base md:text-lg text-muted-foreground text-pretty">
              Join our freelance team and work on projects remotely
            </p>
          </div>
          <Button asChild variant="ghost" className="mt-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <WorkFromHomeForm />
      </div>
    </div>
  )
}
