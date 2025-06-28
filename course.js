const fs = require('fs');
const path = require('path');

const coursesFile = path.join(__dirname, '../data/courses.json');

class Course {
  static getAll() {
    return JSON.parse(fs.readFileSync(coursesFile));
  }

  static getById(id) {
    const courses = this.getAll();
    return courses.find(course => course.id === id);
  }

  static add(course) {
    const courses = this.getAll();
    const newCourse = {
      id: courses.length ? courses[courses.length - 1].id + 1 : 1,
      title: course.title,
      topics: course.topics || [], // Topics link to knowledge.json
    };
    courses.push(newCourse);
    fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2));
    return newCourse;
  }
}

module.exports = Course;