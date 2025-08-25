const express = require('express');
const path = require('path');
const app = express();

// 같은 폴더 내의 정적 파일들 제공 (index.html, app.js, css 등)
app.use(express.static(path.join(__dirname, '.')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
