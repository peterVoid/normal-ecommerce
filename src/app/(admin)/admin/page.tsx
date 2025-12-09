"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// Dummy Data
const stats = [
  {
    title: "Total courses",
    value: "12",
    change: "+25.8%",
    trend: "up",
    color: "bg-green-200 text-green-900",
  },
  {
    title: "Average progress",
    value: "32.5%",
    change: "+0.5%",
    trend: "up",
    color: "bg-cyan-200 text-cyan-900",
    icon: AlertCircle, // Using AlertCircle as a placeholder for the exclamation mark icon
  },
  {
    title: "Assessments score",
    value: "70.41%",
    change: "+14.7%",
    trend: "down",
    color: "bg-red-200 text-red-900",
  },
  {
    title: "Time spent",
    value: "32 days",
    change: "+10%",
    trend: "up",
    color: "bg-green-200 text-green-900",
  },
];

const courses = [
  {
    title: "DevOps for Backend",
    description:
      "Brains and tools needed to integrate development and operations.",
    progress: 50,
    imageColor: "bg-yellow-200",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", // Dummy person image
    accentColor: "bg-yellow-400",
  },
  {
    title: "ReactRevolution",
    description:
      "Join the revolution of modern web development by delving into react.",
    progress: 90,
    imageColor: "bg-cyan-200",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", // Dummy person image
    accentColor: "bg-cyan-400",
  },
  {
    title: "Visual Harmony",
    description: "Visual Harmony",
    progress: 20,
    imageColor: "bg-orange-200",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    accentColor: "bg-orange-400",
  },
  {
    title: "Inclusive Design",
    description: "Inclusive Design",
    progress: 40,
    imageColor: "bg-pink-200",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    accentColor: "bg-pink-400",
  },
];

const calendarDays = [
  { day: 26, currentMonth: false },
  { day: 27, currentMonth: false },
  { day: 28, currentMonth: false },
  { day: 29, currentMonth: false },
  { day: 30, currentMonth: false },
  { day: 31, currentMonth: false },
  { day: 1, currentMonth: true },
  { day: 2, currentMonth: true },
  { day: 3, currentMonth: true },
  { day: 4, currentMonth: true },
  { day: 5, currentMonth: true },
  { day: 6, currentMonth: true },
  { day: 7, currentMonth: true },
  { day: 8, currentMonth: true },
  { day: 9, currentMonth: true },
  { day: 10, currentMonth: true },
  { day: 11, currentMonth: true },
  { day: 12, currentMonth: true, event: "bg-yellow-400" },
  { day: 13, currentMonth: true },
  { day: 14, currentMonth: true, event: "bg-orange-400" },
  { day: 15, currentMonth: true },
  { day: 16, currentMonth: true },
  { day: 17, currentMonth: true, event: "bg-cyan-200" },
  { day: 18, currentMonth: true },
  { day: 19, currentMonth: true },
  { day: 20, currentMonth: true, event: "bg-pink-300" },
  { day: 21, currentMonth: true },
  { day: 22, currentMonth: true },
  { day: 23, currentMonth: true },
  { day: 24, currentMonth: true },
  { day: 25, currentMonth: true, event: "bg-yellow-400" },
  { day: 26, currentMonth: true },
  { day: 27, currentMonth: true },
  { day: 28, currentMonth: true },
  { day: 29, currentMonth: true, event: "bg-cyan-200" },
  { day: 30, currentMonth: true },
  { day: 31, currentMonth: true, event: "bg-orange-400" },
  { day: 1, currentMonth: false },
  { day: 2, currentMonth: false },
  { day: 3, currentMonth: false },
  { day: 4, currentMonth: false },
  { day: 5, currentMonth: false },
];

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Course Statistics */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Course statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-32"
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm">{stat.title}</span>
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold">{stat.value}</span>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${stat.color} border border-black`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.icon && <stat.icon className="h-3 w-3 ml-1" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Enrolled courses</h2>
            <a href="#" className="text-sm font-medium hover:underline">
              view all
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full"
              >
                <div
                  className={`h-32 ${course.imageColor} relative border-b-2 border-black p-4 flex items-center justify-between`}
                >
                  {/* Simulated puzzle cut effect with clip-path if possible, or just a design */}
                  <div className="w-1/2 z-10">
                    <h3 className="font-bold text-lg leading-tight bg-white/80 p-1 inline-block backdrop-blur-sm rounded">
                      {course.title}
                    </h3>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                    {/* Image with a custom shape mask could go here. For now, just the image. */}
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                      style={{
                        clipPath: "polygon(20% 0%, 100% 0, 100% 100%, 0% 100%)",
                      }}
                    />
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Current progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-black">
                      <div
                        className={`h-full ${course.accentColor}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{course.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Courses Plan (Calendar) */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Upcoming courses plan</h2>
          <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <button className="p-1 border border-black rounded hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-bold">September 2023</span>
              <button className="p-1 border border-black rounded hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="font-bold text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {calendarDays.map((date, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded border ${
                    date.event
                      ? `${date.event} border-black font-bold`
                      : "border-transparent hover:bg-gray-50"
                  } ${!date.currentMonth ? "text-gray-300" : ""}`}
                >
                  {date.day}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400 border border-black"></div>{" "}
                Back-end
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-200 border border-black"></div>{" "}
                Front-end
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-pink-300 border border-black"></div>{" "}
                User Experience
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-400 border border-black"></div>{" "}
                User Interface
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-300 border border-black"></div>{" "}
                QA
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
