const { it } = require('@jest/globals');
 
//model test
const express = require("express");
require("dotenv").config();
const app = express();
const indexes = require("./models/indexes");

function fowner(data){
    try{
    const owner = require("./models/owner");
    let test = new owner(data);
    return test;
    }
    catch(e){
        return e.message;
    }
}

test("models/owner/ required fields", () => {

    expect(fowner()).toContain("yleo");
});


