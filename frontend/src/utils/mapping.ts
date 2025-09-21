import { Degree, Career, College } from '../types';

export const mapDegreesToCareers = (degrees: Degree[], careers: Career[]): Record<string, Career[]> => {
    const degreeCareerMap: Record<string, Career[]> = {};

    degrees.forEach(degree => {
        degreeCareerMap[degree.name] = careers.filter(career => career.degreeIds.includes(degree.id));
    });

    return degreeCareerMap;
};

export const mapCollegesToDegrees = (colleges: College[], degrees: Degree[]): Record<string, Degree[]> => {
    const collegeDegreeMap: Record<string, Degree[]> = {};

    colleges.forEach(college => {
        collegeDegreeMap[college.name] = degrees.filter(degree => degree.collegeIds.includes(college.id));
    });

    return collegeDegreeMap;
};

export const mapCareersToDegrees = (careers: Career[], degrees: Degree[]): Record<string, Degree[]> => {
    const careerDegreeMap: Record<string, Degree[]> = {};

    careers.forEach(career => {
        careerDegreeMap[career.name] = degrees.filter(degree => degree.careerIds.includes(career.id));
    });

    return careerDegreeMap;
};