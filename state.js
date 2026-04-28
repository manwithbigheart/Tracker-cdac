export const defaultSyllabus = [
    { id: "algo", title: "Algorithms (Java)", topics: ["Complexity (Big O)", "Arrays, Stacks", "Recursion", "Trees (BST)", "Searching & Sorting", "Graphs", "DP & Greedy"] },
    { id: "os", title: "OS Concepts", topics: ["Process Mgmt", "Memory Mgmt", "Deadlocks", "Linux Shell", "Git & DevOps", "Docker"] },
    { id: "java", title: "Core Java", topics: ["JVM & Basics", "OOP Principles", "Collections", "Streams API", "Multithreading", "Exception Handling"] },
    { id: "web", title: "Web Technologies", topics: ["HTML5 & CSS3", "JavaScript ES6+", "React Hooks", "Node.js & Express", "REST APIs"] },
    { id: "dbms", title: "Database Tech", topics: ["SQL Queries", "Normalization", "Joins", "MongoDB", "NoSQL"] },
    { id: "dotnet", title: "MS.Net Tech", topics: [".Net Framework", "C# Basics", "LINQ", "Async/Await", "ASP.Net MVC"] },
    { id: "cpp", title: "C++ Programming", topics: ["Pointers", "OOP in C++", "Polymorphism", "Templates & STL"] },
    { id: "apt", title: "Aptitude", topics: ["Quant", "Logical Reasoning", "Data Interpretation"] },
    { id: "java_web", title: "Web-based Java", topics: ["JDBC", "Servlets", "JSP", "Hibernate", "Spring Boot", "Microservices"] }
];

export let appState = {
    progress: {},
    syllabus: JSON.parse(JSON.stringify(defaultSyllabus)),
    subjectOrder: defaultSyllabus.map(s => s.id),
    userProfile: { xp: 0, dailyTarget: 5, mistakes: [] }
};

export const focusQuotes = ["Initiate flow state.", "Silence the noise.", "Compile your thoughts.", "Execute."];
export const shortBreakQuotes = ["System cooling down.", "Hydrate.", "Stretch optics."];
export const longBreakQuotes = ["Reboot system.", "Go offline.", "Refuel."];

export let pomoState = { time: 1500, maxTime: 1500, active: false, interval: null, mode: 'focus' };
export let currentModalKey = null;