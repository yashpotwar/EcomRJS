const app = require('./app');  // jahan aapka app.js hai, us path se import karo

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
