import { Smartphone } from "lucide-react";
import { FaReact, FaPython, FaJava, FaNodeJs, FaAws } from 'react-icons/fa';
import { SiSpringboot } from 'react-icons/si';

const expertiseData = {
    0: [
        {
            icon: FaReact,
            title: "Frontend Dev React, NodeJS",
            description: "Experienced in React for fully responsive web applications. Proficient in NodeJS for backend development. The site you are currently viewing is built using React and NodeJS.",
        },
        {
            icon: Smartphone,
            title: "Android Development, Java",
            description: "Developed native Android apps, including a Fitness app that tracks calories and a movie logging app using RESTful APIS and managing app lifecycle using Java.",
        },
        {
            icon: FaPython,
            title: "Software Development",
            description: "Thorough understanding of Object-Oriented Programming, specifically, Java and Python. I have learned and applied concepts of encapsulation, inheritance, abstraction and polymorphism.",
        },
    ],
    1: [
        {
            icon: FaJava,
            title: "Backend Development",
            description: "Extensive experience with Java and Spring Boot for building scalable microservices and RESTful APIs.",
        },
        {
            icon: FaNodeJs,
            title: "Full Stack Development",
            description: "Proficient in Node.js and React for building modern web applications with responsive design and optimal performance.",
        },
        {
            icon: FaAws,
            title: "Cloud Architecture",
            description: "Experienced in AWS cloud services, containerization with Docker, and CI/CD pipeline implementation.",
        },
    ]
};

export default expertiseData;