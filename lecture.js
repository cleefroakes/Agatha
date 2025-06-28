const fs = require('fs');
const path = require('path');

const lecturesFile = path.join(__dirname, '../data/lectures.json');

class Lecture {
  static getAll() {
    return JSON.parse(fs.readFileSync(lecturesFile));
  }

  static getById(id) {
    const lectures = this.getAll();
    return lectures.find(lecture => lecture.id === id);
  }

  static getByCourseId(courseId) {
    const lectures = this.getAll();
    return lectures.filter(lecture => lecture.courseId === courseId);
  }

  static add(lecture) {
    const lectures = this.getAll();
    const newLecture = {
      id: lectures.length ? lectures[lectures.length - 1].id + 1 : 1,
      courseId: lecture.courseId,
      topic: lecture.topic,
      question: lecture.question,
      response: lecture.response,
      chartData: lecture.chartData || null,
      audioUrl: lecture.audioUrl || null,
    };
    lectures.push(newLecture);
    fs.writeFileSync(lecturesFile, JSON.stringify(lectures, null, 2));
    return newLecture;
  }
}

module.exports = Lecture;