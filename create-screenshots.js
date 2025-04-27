// Create badge SVG files for the application
// First Course Completed badge
const fs = require('fs');
const path = require('path');

// Simple HTML templates for screenshots
const dashboardScreenshot = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Program Builder</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-indigo-600">Program Builder</span>
          </div>
          <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Programs
            </a>
            <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              My Courses
            </a>
            <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Achievements
            </a>
          </nav>
        </div>
        <div class="flex items-center">
          <div class="flex items-center space-x-4">
            <div class="font-bold text-indigo-600">125 points</div>
            <div class="text-sm font-medium text-gray-700">John Doe</div>
            <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-semibold">J</div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Welcome back, John Doe!
      </h1>
      <p class="text-gray-600">
        Continue your learning journey and track your progress.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-sm h-full">
          <h2 class="text-lg font-semibold mb-4">Your Learning Progress</h2>
          
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Overall Completion</span>
              <span class="text-sm text-gray-500">35%</span>
            </div>
            <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-4 rounded-full" style="width: 35%"></div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-indigo-50 p-4 rounded-md">
              <h3 class="text-sm font-medium text-indigo-800 mb-1">Courses Completed</h3>
              <p class="text-2xl font-bold text-indigo-900">3</p>
            </div>
            <div class="bg-green-50 p-4 rounded-md">
              <h3 class="text-sm font-medium text-green-800 mb-1">Assessments Passed</h3>
              <p class="text-2xl font-bold text-green-900">7</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Your Achievements</h2>
          <div class="font-bold text-indigo-600">125 points</div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="flex flex-col items-center">
            <div class="relative rounded-full overflow-hidden border-2 border-yellow-400 p-2">
              <div class="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full text-white font-bold">
                FC
              </div>
            </div>
            <div class="mt-2 text-center font-medium text-sm">First Course</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="relative rounded-full overflow-hidden border-2 border-purple-400 p-2">
              <div class="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-300 to-purple-600 rounded-full text-white font-bold">
                PS
              </div>
            </div>
            <div class="mt-2 text-center font-medium text-sm">Perfect Score</div>
          </div>
        </div>
        
        <div class="text-center">
          <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">
            View all achievements
          </a>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Your Enrolled Programs</h2>
        <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">
          Browse all programs
        </a>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              Introduction to Web Development
            </h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              Learn the basics of HTML, CSS, and JavaScript
            </p>
            <div class="mt-2 mb-4">
              <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-4 rounded-full" style="width: 40%"></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                2 of 5 courses completed
              </p>
            </div>
            <div class="mt-4">
              <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                Continue Learning
              </a>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              Data Science Fundamentals
            </h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              Explore the world of data analysis and visualization
            </p>
            <div class="mt-2 mb-4">
              <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-4 rounded-full" style="width: 25%"></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                1 of 4 courses completed
              </p>
            </div>
            <div class="mt-4">
              <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                Continue Learning
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
`;

const programsScreenshot = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Programs - Program Builder</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-indigo-600">Program Builder</span>
          </div>
          <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="#" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Programs
            </a>
            <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              My Courses
            </a>
            <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Achievements
            </a>
          </nav>
        </div>
        <div class="flex items-center">
          <div class="flex items-center space-x-4">
            <div class="font-bold text-indigo-600">125 points</div>
            <div class="text-sm font-medium text-gray-700">John Doe</div>
            <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-semibold">J</div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Programs
      </h1>
      <p class="text-gray-600">
        Browse and enroll in educational programs to start your learning journey.
      </p>
    </div>

    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-2">
        <button class="px-4 py-2 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700">
          All Programs
        </button>
        <button class="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
          My Enrollments
        </button>
        <button class="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
          Completed
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Introduction to Web Development
          </h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            Learn the basics of HTML, CSS, and JavaScript to build your first website.
          </p>
          <div class="mt-2 mb-4">
            <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-4 rounded-full" style="width: 40%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              2 of 5 courses completed
            </p>
          </div>
          <div class="mt-4">
            <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              Continue Learning
            </a>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Data Science Fundamentals
          </h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            Explore the world of data analysis and visualization with Python and popular libraries.
          </p>
          <div class="mt-2 mb-4">
            <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-4 rounded-full" style="width: 25%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              1 of 4 courses completed
            </p>
          </div>
          <div class="mt-4">
            <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              Continue Learning
            </a>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Mobile App Development
          </h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            Learn to build cross-platform mobile applications using React Native.
          </p>
          <div class="mt-4">
            <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              View Program
            </a>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            UX/UI Design Principles
          </h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            Master the fundamentals of user experience and interface design.
          </p>
          <div class="mt-4">
            <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              View Program
            </a>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Digital Marketing Essentials
          </h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            Learn effective strategies for online marketing and customer engagement.
          </p>
          <div class="mt-4">
            <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              View Program
            </a>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Project Management Basics
          </h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            Understand the core principles of successful project management.
          </p>
          <div class="mt-4">
            <a href="#" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              View Program
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
`;

const achievementsScreenshot = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Achievements - Program Builder</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex ite
(Content truncated due to size limit. Use line ranges to read in chunks)