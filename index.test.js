const app = require("./index.js");
require("dotenv").config();
const DB = process.env.testDB;
const mongoose = require("mongoose");
const supertest = require("supertest");

beforeEach((done) => {
  mongoose.connect(
    DB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});
afterAll((done) => {
  mongoose.connection.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test("POST /api/owner",async ()=>{
    await supertest(app).post("/api/owner").expect(200).then((response)=>{
        let id = response.id;
        expect((id.exists()).toBeTruthy());
    });
});