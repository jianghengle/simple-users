import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Introduction Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              AWS &amp; Robotics Solutions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Bee-Archi LLC provides tech solutions and consultation for AWS
              cloud infrastructure and robotics. From AI-powered cloud servers to
              email migration and workflow management, we help businesses
              leverage AWS with practical, cost-effective products.
            </p>
          </div>
        </section>

        {/* Puffy Robot Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700 mb-4">
                Robotics
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Puffy
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A screen-free, AI-powered home practice companion for children
                with Autism Spectrum Disorder (ASD) and ADHD. Puffy helps kids
                build social, communication, language, and daily-living skills
                through frequent, structured practice at home — guiding a child
                by voice through scenarios selected by parents, therapists, or
                educators.
              </p>
              <p className="text-gray-600 mb-8">
                Designed as a friendly physical companion rather than another
                screen, Puffy uses voice interaction, repetition, patient
                prompting, and positive feedback in a predictable, low-pressure
                setting. It bridges professional guidance and everyday home
                practice — built to extend human support, not replace it.
                Puffy will debut as a working prototype at CES 2026.
              </p>
            </div>
            <div>
                <img src="/puffy.png" alt="Puffy robot prototype — front, 3/4, back, and side views" />
              </div>
          </div>
        </section>

        {/* Claw EC2 Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 mb-4">
                AI Cloud Server
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Claw EC2
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A cloud server with{" "}
                <span className="font-semibold text-gray-800">OpenClaw</span>{" "}
                pre-installed and running 24/7. No tech experience needed — just
                chat with OpenClaw as your AI agent to develop, maintain, and
                deploy web apps directly on the server.
              </p>
              <p className="text-gray-600 mb-8">
                OpenClaw communicates with other apps to perform any task for
                you, and because it runs on always-on cloud infrastructure, your
                AI agent works around the clock on whatever you need.
              </p>
              <Link
                href="https://ec2.bee-archi.com"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Visit Claw EC2
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* AWS WorkMail Migration Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-orange-50">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-700 mb-4">
                Email Migration
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AWS WorkMail Migration
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A one-time migration service for businesses affected by the AWS
                WorkMail shutdown. We reconfigure and preserve your business
                email workflows directly inside your own AWS environment — no
                platform lock-in, no recurring fees.
              </p>
              <p className="text-gray-600 mb-8">
                Unlimited users at no extra cost, shared storage with no
                per-person limits, and minimal downtime. Most migrations complete
                in a single session.
              </p>
              <Link
                href="/aws-email-migration"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
              >
                Learn More
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Myworkflowhub.com Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700 mb-4">
                Workflow Platform
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Myworkflowhub.com
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A free, configurable workflow management platform. With minimal
                setup, you can create collaborative workflows for your
                organization — such as invoice management, approval processes, or
                any custom business workflow.
              </p>
              <p className="text-gray-600 mb-8">
                Fully customizable: define fields, states, transitions, and
                per-state user permissions. Each tenant&apos;s data is hosted
                securely in their own AWS account, keeping your data isolated and
                under your control.
              </p>
              <Link
                href="https://myworkflowhub.com"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Visit Myworkflowhub.com
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
