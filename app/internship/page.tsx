import InternshipForm from "@/components/internship-form"
import Image from "next/image"

export default function InternshipPage() {
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
              IT Internship Application
            </h1>
            <p className="text-base md:text-lg text-muted-foreground text-pretty">
              Join our team and gain hands-on experience with real-world projects
            </p>
          </div>
        </div>

        <InternshipForm />
      </div>
    </div>
  )
}
