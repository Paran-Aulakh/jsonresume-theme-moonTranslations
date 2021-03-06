var theme = require("../index.js");
var resumeJson = require("./resume.json");
var chai = require("chai");
var expect = chai.expect;

describe('theme', function () {
  var resumeHTML = theme.render(resumeJson);
  it('should render html from resume json', function () {
    expect(resumeHTML.length).to.be.greaterThan(0);
  });

  it('should render html with correct DOCTYPE', function () {
    expect(resumeHTML.indexOf("<!DOCTYPE html>")).to.be.greaterThan(-1);
  });

});