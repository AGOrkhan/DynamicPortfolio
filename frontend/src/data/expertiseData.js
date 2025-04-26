import { Smartphone } from "lucide-react";
import { FaReact, FaPython, FaJava, FaNodeJs, FaAws, FaNetworkWired  } from 'react-icons/fa';
import { PiStack } from "react-icons/pi";
import { LuBrainCircuit } from "react-icons/lu";

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
            icon: PiStack,
            title: "Full Stack Development",
            description: "Experienced in building scalable web applications with a strong emphasis on backend systems using Java, Spring Boot, Django, and Node.js, while delivering responsive front-end solutions with React and Vaadin. Solid background in API design, database management, and system optimization.",
        },
        {
            icon: FaNetworkWired,
            title: "Network and Systems Engineering",
            description: "Proficient in Linux and Windows server administration, network troubleshooting, and systems optimization. Experienced in deploying secure server environments, configuring networks, and maintaining high-availability systems for production environments.",
        },
        {
            icon: LuBrainCircuit,
            title: "Artificial Intelligence Development",
            description: "Proficient in designing machine learning and computer vision solutions using reinforcement learning, deep learning, and real-time inference. Experienced in training AI agents with Unity ML-Agents, building scalable AI systems, and applying intelligent models for automation and optimization tasks.",
        },
    ]
};

export default expertiseData;