const { renderResume } = require('./src/modules/rendering/render.service');

const html = renderResume('classic', {
  personalInfo: {
    name: 'Biswaranjan Pradhan',
    email: 'test@gmail.com'
  },
  summary: 'Full Stack Developer'
});

console.log(html);