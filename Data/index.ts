export const standards = {
  "1": {
    classes: ["Dhruv", "Nachiketa"],
    subjects: [
      "Gujarati",
      "Mathematics",
      "English",
      "Hindi",
      "General Knowledge",

      "Computer",
    ],
  },
  "2": {
    classes: ["Nachiketa"],
    subjects: [
      "Gujarati",
      "Mathematics",
      "English",
      "Hindi",
      "General Knowledge",
      "Computer",
    ],
  },
  "3": {
    classes: ["Dhruv", "Nachiketa", "Prahlad"],
    subjects: [
      "Gujarati",
      "Mathematics",
      "English",
      "Hindi",
      "General Knowledge",
      "Computer",
      "Enviornment",
    ],
  },
  "4": {
    classes: ["Dhruv", "Nachiketa", "Prahlad"],
    subjects: [
      "Gujarati",
      "Mathematics",
      "English",
      "Hindi",
      "General Knowledge",
      "Computer",
      "Enviornment",
    ],
  },
  "5": {
    classes: ["Dhruv", "Nachiketa", "Prahlad"],
    subjects: [
      "Gujarati",
      "Mathematics",
      "English",
      "Hindi",
      "General Knowledge",
      "Computer",
      "Enviornment",
    ],
  },
  "6": {
    classes: ["Dhruv", "Nachiketa", "Prahlad"],
    subjects: [
      "Mathematics",
      "Science",
      "Hindi",
      "Gujarati",
      "Sanskrit",
      "English",
      "Social Science",
      " G.k",
      "Geeta",
      "Computer",
    ],
  },
  "7": {
    classes: ["Dhruv", "Nachiketa", "Prahlad"],
    subjects: [
      "Mathematics",
      "Science",
      "Hindi",
      "Gujarati",
      "Sanskrit",
      "English",
      "Social Science",
      " G.k",
      "Geeta",
      "Computer",
    ],
  },
  "8": {
    classes: ["Dhruv", "Nachiketa","Foundation"],
    subjects: [
      "Mathematics",
      "Science",
      "Hindi",
      "Gujarati",
      "Sanskrit",
      "English",
      "Social Science",
      " G.k",
      "Geeta",
      "Computer",
    ],
  },
  "9": {
    classes: ["A", "B","C", "Foundation"],
    subjects: [
      "Hindi",
      "Sanskrit",
      "Maths",
      "Science",
      "Gujarati",
      "Social Science",
      "English",
    ],
  },
  "10": {
    classes: ["A", "B"],
    subjects: [
      "Sanskrit",
      "Maths",
      "Science",
      "Gujarati",
      "Social Science",
      "English",
    ],
  },
  "11": {
    classes: ["Maths", "Biology"],
    subjects: [
      "Chemistry ",
      "Physics",
      "Maths ",
      "Biology",
      "English ",
      "Computer",
      "Sanskrit",
    ],
  },
  "12": {
    classes: ["Maths", "Biology"],
    subjects: [
      "Chemistry ",
      "Physics",
      "Maths ",
      "Biology",
      "English ",
      "Computer",
      "Sanskrit",
    ],
  },
} as const;

export type StandardKey = keyof typeof standards;
export type ClassData = (typeof standards)[StandardKey];
export type Subject = (typeof standards)[StandardKey];
